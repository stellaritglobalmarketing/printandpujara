-- Homepage featured services (1 Oct 2026): Mug Print leaves the featured list, 3D Printing joins it in
-- second place, and Cartons & Label Printing is added as a regular Packaging service.
-- Mirrors backend/seeds/feature-3d-printing.js so the live database ends up in the same state as local.
-- Upload first: backend/uploads/services/3d-printing.webp and backend/uploads/services/cartons-label-printing.webp
-- Run in phpMyAdmin after insert-homepage-corrections.sql. Safe to rerun.
START TRANSACTION;

-- Mug Print stays on the services page; it only leaves the homepage featured list.
UPDATE services SET is_featured = 0 WHERE slug = 'gifting-ideas-mug-print';

INSERT INTO services
(category_id, title, slug, short_description, description, featured_image_url,
 meta_title, meta_description, sort_order, is_featured, is_active, is_delete)
SELECT c.id,
 'Cartons & Label Printing',
 'packaging-cartons-label-printing',
 'Printed mono cartons and product labels in brand-accurate colour, with lamination, foiling and die-cut shapes.',
 'We print mono cartons and product labels for retail, pharma, food and FMCG brands: offset-printed artwork in consistent colour, finished with lamination, foiling, UV and die-cut shapes, ready for packing lines.',
 '/uploads/services/cartons-label-printing.webp',
 'Carton & Label Printing | Pujara Print N Pack',
 'Printed mono cartons and product labels in brand-accurate colour with lamination, foiling and die-cut finishes.',
 202, 0, 1, 0
FROM service_categories c
WHERE c.slug = 'packaging'
  AND NOT EXISTS (SELECT 1 FROM services WHERE slug = 'packaging-cartons-label-printing');
UPDATE services SET is_featured = 0, featured_image_url = '/uploads/services/cartons-label-printing.webp'
WHERE slug = 'packaging-cartons-label-printing';

-- 3D Printing gets its own category and service.
INSERT INTO service_categories (name, slug, description, image_url, sort_order, is_active, is_delete)
SELECT '3D Printing', '3d-printing',
 'Custom 3D printing for prototypes, architectural models and creative products. Bring your ideas to life with detailed, dimensional prints.',
 '/uploads/services/3d-printing.webp',
 (SELECT COALESCE(MAX(sort_order), 0) + 1 FROM service_categories AS existing), 1, 0
WHERE NOT EXISTS (SELECT 1 FROM service_categories WHERE slug = '3d-printing');

INSERT INTO services
(category_id, title, slug, short_description, description, featured_image_url,
 sort_order, is_featured, is_active, is_delete)
SELECT c.id, '3D Printing', '3d-printing',
 'Custom 3D printing for prototypes, architectural models and creative products. Bring your ideas to life with detailed, dimensional prints.',
 'Custom 3D printing for prototypes, architectural models and creative products. Bring your ideas to life with detailed, dimensional prints.',
 '/uploads/services/3d-printing.webp',
 2, 1, 1, 0
FROM service_categories c
WHERE c.slug = '3d-printing'
  AND NOT EXISTS (SELECT 1 FROM services WHERE slug = '3d-printing');
UPDATE services SET is_featured = 1, is_active = 1, is_delete = 0 WHERE slug = '3d-printing';

-- Renumber the featured list 1..n with 3D Printing in second place (same result on every rerun).
SET @position := 0;
UPDATE services SET sort_order = (@position := @position + 1)
WHERE is_featured = 1 AND is_active = 1 AND is_delete = 0 AND slug <> '3d-printing'
ORDER BY sort_order, id;
UPDATE services SET sort_order = sort_order + 1
WHERE is_featured = 1 AND is_active = 1 AND is_delete = 0 AND slug <> '3d-printing' AND sort_order >= 2;
UPDATE services SET sort_order = 2 WHERE slug = '3d-printing';

COMMIT;

SELECT s.id, s.title, c.slug AS category, s.sort_order, s.featured_image_url
FROM services s JOIN service_categories c ON c.id = s.category_id
WHERE s.is_featured = 1 AND s.is_active = 1 AND s.is_delete = 0
ORDER BY s.sort_order, s.id
LIMIT 6;
