import { createEnquiryMailTemplate } from "../../../config/mail.js";
import express from "express";
import crypto from "crypto";
import db from "../../../config/db.js";
import common from "../../../config/common.js";
import Codes from "../../../config/status_codes.js";
import middleware from "../../../middleware/middleware.js";
import { parsePagination, buildPagination, isFeaturedFlag, cleanParam } from "./helpers.js";
import { getPortfolioPage, getPortfolioCategories, getPortfolio, getPortfolioBySlug } from "./portfolio.controller.js";

const router = express.Router();
router.get("/portfolio-page", getPortfolioPage);

// ---------------------------------------------------------------------------
// COMMON
// ---------------------------------------------------------------------------

router.get("/site-settings", async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT id, site_name, logo_url, favicon_url, email, phone, secondary_phone,
                    whatsapp, address, map_embed_url, footer_text
             FROM site_settings
             LIMIT 1`,
            [],
        );

        const settings = rows[0];
        if (!settings) {
            return middleware.sendResponse(
                res,
                Codes.SUCCESS,
                Codes.NO_DATA_FOUND,
                "Site settings not found",
            );
        }

        return middleware.sendResponse(
            res,
            Codes.SUCCESS,
            Codes.RESPONSE_SUCCESS,
            "Site settings fetched successfully",
            settings,
        );
    } catch (error) {
        console.error("Get site settings error:", error);
        return middleware.sendResponse(
            res,
            Codes.INTERNAL_ERROR,
            Codes.RESPONSE_ERROR,
            "INTERNAL_SERVER_ERROR",
        );
    }
});

router.get("/social-links", async (req, res) => {
    try {
        const [links] = await db.query(
            `SELECT id, platform, url, sort_order
             FROM social_links
             WHERE is_active = 1 AND is_delete = 0
             ORDER BY sort_order ASC`,
            [],
        );

        return middleware.sendResponse(
            res,
            Codes.SUCCESS,
            Codes.RESPONSE_SUCCESS,
            "Social links fetched successfully",
            links,
        );
    } catch (error) {
        console.error("Get social links error:", error);
        return middleware.sendResponse(
            res,
            Codes.INTERNAL_ERROR,
            Codes.RESPONSE_ERROR,
            "INTERNAL_SERVER_ERROR",
        );
    }
});

// ---------------------------------------------------------------------------
// SERVICE CATEGORIES
// ---------------------------------------------------------------------------

router.get("/service-categories", async (req, res) => {
    try {
        const [categories] = await db.query(
            `SELECT id, name, slug, description, image_url, sort_order
             FROM service_categories
             WHERE is_active = 1 AND is_delete = 0
             ORDER BY sort_order ASC`,
            [],
        );

        return middleware.sendResponse(
            res,
            Codes.SUCCESS,
            Codes.RESPONSE_SUCCESS,
            "Service categories fetched successfully",
            categories ,
        );
    } catch (error) {
        console.error("Get service categories error:", error);
        return middleware.sendResponse(
            res,
            Codes.INTERNAL_ERROR,
            Codes.RESPONSE_ERROR,
            "INTERNAL_SERVER_ERROR",
        );
    }
});

// ---------------------------------------------------------------------------
// SERVICES
// ---------------------------------------------------------------------------

router.get("/services", async (req, res) => {
    try {
        const { page, limit, offset } = parsePagination(req.query, 12);
        const category = cleanParam(req.query.category);
        const featured = isFeaturedFlag(req.query.featured);

        const conditions = ["s.is_active = 1", "s.is_delete = 0"];
        const params = [];

        if (category) {
            conditions.push("c.slug = ?");
            params.push(category);
        }
        if (featured) {
            conditions.push("s.is_featured = 1");
        }

        const whereClause = conditions.join(" AND ");

        const [countRows] = await db.query(
            `SELECT COUNT(*) AS total
             FROM services s
             JOIN service_categories c ON c.id = s.category_id
             WHERE ${whereClause}`,
            params,
        );
        const total = countRows[0]?.total || 0;

        const [services] = await db.query(
            `SELECT s.id, s.title, s.slug, s.short_description, s.featured_image_url,
                    s.category_id, c.name AS category_name, c.slug AS category_slug,
                    s.is_featured, s.sort_order
             FROM services s
             JOIN service_categories c ON c.id = s.category_id
             WHERE ${whereClause}
             ORDER BY s.sort_order ASC
             LIMIT ? OFFSET ?`,
            [...params, limit, offset],
        );

        return middleware.sendResponse(
            res,
            Codes.SUCCESS,
            Codes.RESPONSE_SUCCESS,
            "Services fetched successfully",
            services,
            buildPagination(page, limit, total),
        );
    } catch (error) {
        console.error("Get services error:", error);
        return middleware.sendResponse(
            res,
            Codes.INTERNAL_ERROR,
            Codes.RESPONSE_ERROR,
            "INTERNAL_SERVER_ERROR",
        );
    }
});

router.get("/services/:slug", async (req, res) => {
    try {
        const slug = cleanParam(req.params.slug, 255);
        if (!slug) {
            return middleware.sendResponse(
                res,
                Codes.SUCCESS,
                Codes.NO_DATA_FOUND,
                "Service not found",
            );
        }

        const [rows] = await db.query(
            `SELECT s.id, s.title, s.slug, s.short_description, s.description, s.featured_image_url,
                    s.category_id, c.name AS category_name, c.slug AS category_slug,
                    s.meta_title, s.meta_description, s.is_featured
             FROM services s
             JOIN service_categories c ON c.id = s.category_id
             WHERE s.slug = ? AND s.is_active = 1 AND s.is_delete = 0
             LIMIT 1`,
            [slug],
        );

        const service = rows[0];
        if (!service) {
            return middleware.sendResponse(
                res,
                Codes.SUCCESS,
                Codes.NO_DATA_FOUND,
                "Service not found",
            );
        }

        return middleware.sendResponse(
            res,
            Codes.SUCCESS,
            Codes.RESPONSE_SUCCESS,
            "Service fetched successfully",
            service,
        );
    } catch (error) {
        console.error("Get service detail error:", error);
        return middleware.sendResponse(
            res,
            Codes.INTERNAL_ERROR,
            Codes.RESPONSE_ERROR,
            "INTERNAL_SERVER_ERROR",
        );
    }
});

// ---------------------------------------------------------------------------
// PORTFOLIO
// ---------------------------------------------------------------------------

router.get("/portfolio-categories", getPortfolioCategories);
router.get("/portfolio", getPortfolio);
router.get("/portfolio/:slug", getPortfolioBySlug);

// ---------------------------------------------------------------------------
// TESTIMONIALS (also the source of homepage client logos via client_image_url)
// ---------------------------------------------------------------------------

router.get("/testimonials", async (req, res) => {
    try {
        const { page, limit, offset } = parsePagination(req.query, 6);
        const featured = isFeaturedFlag(req.query.featured);
        const logosOnly = isFeaturedFlag(req.query.logos_only);

        const conditions = ["is_active = 1", "is_delete = 0"];
        const params = [];

        if (featured) {
            conditions.push("is_featured = 1");
        }
        if (logosOnly) {
            conditions.push("client_image_url IS NOT NULL");
            conditions.push("client_image_url <> ''");
        }

        const whereClause = conditions.join(" AND ");

        const [countRows] = await db.query(
            `SELECT COUNT(*) AS total FROM testimonials WHERE ${whereClause}`,
            params,
        );
        const total = countRows[0]?.total || 0;

        const [rows] = await db.query(
            `SELECT id, client_name, company_name, designation, message,
                    client_image_url, is_company_public, is_featured, sort_order
             FROM testimonials
             WHERE ${whereClause}
             ORDER BY sort_order ASC
             LIMIT ? OFFSET ?`,
            [...params, limit, offset],
        );

        const items = rows.map(({ is_company_public, ...item }) => ({
            ...item,
            company_name: is_company_public ? item.company_name : null,
        }));

        return middleware.sendResponse(
            res,
            Codes.SUCCESS,
            Codes.RESPONSE_SUCCESS,
            "Testimonials fetched successfully",
            items,
            buildPagination(page, limit, total),
        );
    } catch (error) {
        console.error("Get testimonials error:", error);
        return middleware.sendResponse(
            res,
            Codes.INTERNAL_ERROR,
            Codes.RESPONSE_ERROR,
            "INTERNAL_SERVER_ERROR",
        );
    }
});

// ---------------------------------------------------------------------------
// BLOGS
// ---------------------------------------------------------------------------

router.get("/blog-categories", async (req, res) => {
    try {
        const [categories] = await db.query(
            `SELECT id, name, slug, description, sort_order
             FROM blog_categories
             WHERE is_active = 1 AND is_delete = 0
             ORDER BY sort_order ASC`,
            [],
        );

        return middleware.sendResponse(
            res,
            Codes.SUCCESS,
            Codes.RESPONSE_SUCCESS,
            "Blog categories fetched successfully",
            categories,
        );
    } catch (error) {
        console.error("Get blog categories error:", error);
        return middleware.sendResponse(
            res,
            Codes.INTERNAL_ERROR,
            Codes.RESPONSE_ERROR,
            "INTERNAL_SERVER_ERROR",
        );
    }
});

router.get("/blogs", async (req, res) => {
    try {
        const { page, limit, offset } = parsePagination(req.query, 10);
        const category = cleanParam(req.query.category);
        const featured = isFeaturedFlag(req.query.featured);
        const search = cleanParam(req.query.search, 100);

        const conditions = [
            "b.is_active = 1",
            "b.is_delete = 0",
            "b.published_at IS NOT NULL",
            "b.published_at <= NOW()",
        ];
        const params = [];

        if (category) {
            conditions.push("c.slug = ?");
            params.push(category);
        }
        if (featured) {
            conditions.push("b.is_featured = 1");
        }
        if (search) {
            conditions.push("(b.title LIKE ? OR b.excerpt LIKE ?)");
            params.push(`%${search}%`, `%${search}%`);
        }

        const whereClause = conditions.join(" AND ");

        const [countRows] = await db.query(
            `SELECT COUNT(*) AS total
             FROM blogs b
             LEFT JOIN blog_categories c ON c.id = b.category_id
             WHERE ${whereClause}`,
            params,
        );
        const total = countRows[0]?.total || 0;

        const [blogs] = await db.query(
            `SELECT b.id, b.title, b.slug, b.excerpt, b.featured_image_url, b.author_name,
                    b.published_at, b.category_id, c.name AS category_name, c.slug AS category_slug,
                    b.is_featured
             FROM blogs b
             LEFT JOIN blog_categories c ON c.id = b.category_id
             WHERE ${whereClause}
             ORDER BY b.published_at DESC
             LIMIT ? OFFSET ?`,
            [...params, limit, offset],
        );

        return middleware.sendResponse(
            res,
            Codes.SUCCESS,
            Codes.RESPONSE_SUCCESS,
            "Blogs fetched successfully",
            blogs,
            buildPagination(page, limit, total),
        );
    } catch (error) {
        console.error("Get blogs error:", error);
        return middleware.sendResponse(
            res,
            Codes.INTERNAL_ERROR,
            Codes.RESPONSE_ERROR,
            "INTERNAL_SERVER_ERROR",
        );
    }
});

router.get("/blogs/:slug", async (req, res) => {
    try {
        const slug = cleanParam(req.params.slug, 255);
        if (!slug) {
            return middleware.sendResponse(
                res,
                Codes.SUCCESS,
                Codes.NO_DATA_FOUND,
                "Blog not found",
            );
        }

        const [rows] = await db.query(
            `SELECT b.id, b.title, b.slug, b.excerpt, b.content, b.featured_image_url, b.author_name,
                    b.published_at, b.category_id, c.name AS category_name, c.slug AS category_slug,
                    b.meta_title, b.meta_description
             FROM blogs b
             LEFT JOIN blog_categories c ON c.id = b.category_id
             WHERE b.slug = ? AND b.is_active = 1 AND b.is_delete = 0
                   AND b.published_at IS NOT NULL AND b.published_at <= NOW()
             LIMIT 1`,
            [slug],
        );

        const blog = rows[0];
        if (!blog) {
            return middleware.sendResponse(
                res,
                Codes.SUCCESS,
                Codes.NO_DATA_FOUND,
                "Blog not found",
            );
        }

        return middleware.sendResponse(
            res,
            Codes.SUCCESS,
            Codes.RESPONSE_SUCCESS,
            "Blog fetched successfully",
            blog,
        );
    } catch (error) {
        console.error("Get blog detail error:", error);
        return middleware.sendResponse(
            res,
            Codes.INTERNAL_ERROR,
            Codes.RESPONSE_ERROR,
            "INTERNAL_SERVER_ERROR",
        );
    }
});

// ---------------------------------------------------------------------------
// MACHINES
// ---------------------------------------------------------------------------

router.get("/machines", async (req, res) => {
    try {
        const { page, limit, offset } = parsePagination(req.query, 12);
        const featured = isFeaturedFlag(req.query.featured);

        const conditions = ["is_active = 1", "is_delete = 0"];
        const params = [];

        if (featured) {
            conditions.push("is_featured = 1");
        }

        const whereClause = conditions.join(" AND ");

        const [countRows] = await db.query(
            `SELECT COUNT(*) AS total FROM machines WHERE ${whereClause}`,
            params,
        );
        const total = countRows[0]?.total || 0;

        const [machines] = await db.query(
            `SELECT id, name, slug, machine_type, short_description, featured_image_url, is_featured, sort_order
             FROM machines
             WHERE ${whereClause}
             ORDER BY sort_order ASC
             LIMIT ? OFFSET ?`,
            [...params, limit, offset],
        );

        return middleware.sendResponse(
            res,
            Codes.SUCCESS,
            Codes.RESPONSE_SUCCESS,
            "Machines fetched successfully",
            machines,
            buildPagination(page, limit, total),
        );
    } catch (error) {
        console.error("Get machines error:", error);
        return middleware.sendResponse(
            res,
            Codes.INTERNAL_ERROR,
            Codes.RESPONSE_ERROR,
            "INTERNAL_SERVER_ERROR",
        );
    }
});

router.get("/machines/:slug", async (req, res) => {
    try {
        const slug = cleanParam(req.params.slug, 255);
        if (!slug) {
            return middleware.sendResponse(
                res,
                Codes.SUCCESS,
                Codes.NO_DATA_FOUND,
                "Machine not found",
            );
        }

        const [rows] = await db.query(
            `SELECT id, name, slug, machine_type, short_description, description, specifications, featured_image_url
             FROM machines
             WHERE slug = ? AND is_active = 1 AND is_delete = 0
             LIMIT 1`,
            [slug],
        );

        const machine = rows[0];
        if (!machine) {
            return middleware.sendResponse(
                res,
                Codes.SUCCESS,
                Codes.NO_DATA_FOUND,
                "Machine not found",
            );
        }

        return middleware.sendResponse(
            res,
            Codes.SUCCESS,
            Codes.RESPONSE_SUCCESS,
            "Machine fetched successfully",
            machine,
        );
    } catch (error) {
        console.error("Get machine detail error:", error);
        return middleware.sendResponse(
            res,
            Codes.INTERNAL_ERROR,
            Codes.RESPONSE_ERROR,
            "INTERNAL_SERVER_ERROR",
        );
    }
});

// ---------------------------------------------------------------------------
// CONTACT
// ---------------------------------------------------------------------------

router.post("/contact", async (req, res) => {
    try {
        const body = req.body || {};

        const name = cleanParam(body.name, 150);
        const email = cleanParam(body.email, 150);
        const phone = cleanParam(body.phone, 20);
        const company = cleanParam(body.company, 150);
        const subject = cleanParam(body.subject, 200);
        const message = cleanParam(body.message, 2000);

        if (!name || !email || !message) {
            return middleware.sendResponse(
                res,
                Codes.SUCCESS,
                Codes.MISSING_FIELD,
                "Name, email and message are required",
            );
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return middleware.sendResponse(
                res,
                Codes.SUCCESS,
                Codes.MISSING_FIELD,
                "Please provide a valid email address",
            );
        }

        if (phone) {
            const phoneRegex = /^[0-9+\-\s()]{6,20}$/;
            if (!phoneRegex.test(phone)) {
                return middleware.sendResponse(
                    res,
                    Codes.SUCCESS,
                    Codes.MISSING_FIELD,
                    "Please provide a valid phone number",
                );
            }
        }

        const ip = (req.headers["x-forwarded-for"] || req.ip || "").toString().split(",")[0].trim();
        const ipHash = ip ? crypto.createHash("sha256").update(ip).digest("hex") : null;

        const [result] = await db.query(
            `INSERT INTO contact_enquiries (name, email, phone, company, subject, message, ip_hash, is_read, is_delete)
             VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0)`,
            [name, email, phone || null, company || null, subject || null, message, ipHash],
        );

        let notificationSent = false;
        try {
            const notifyEmail = process.env.CONTACT_NOTIFY_EMAIL || process.env.MAIL_FROM || process.env.SMTP_USER;
            const template = createEnquiryMailTemplate({ id: result.insertId, name, email, phone, company, subject, message });
            await common.sendEnquiryMail({
                toEmail: notifyEmail,
                replyTo: { name, address: email },
                subject: template.subject,
                htmlMessage: template.html,
                textMessage: template.text,
            });
            notificationSent = true;
        } catch (mailError) {
            console.error("Contact enquiry notification failed", { enquiryId: result.insertId, code: mailError.code || "MAIL_ERROR" });
        }

        return middleware.sendResponse(
            res,
            Codes.SUCCESS,
            Codes.RESPONSE_SUCCESS,
            "Your enquiry has been submitted successfully",
            { id: result.insertId, notification_sent: notificationSent },
        );
    } catch (error) {
        console.error("Submit contact enquiry error:", error);
        return middleware.sendResponse(
            res,
            Codes.INTERNAL_ERROR,
            Codes.RESPONSE_ERROR,
            "INTERNAL_SERVER_ERROR",
        );
    }
});

export default router;
