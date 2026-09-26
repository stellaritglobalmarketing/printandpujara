-- Upload both PNG files to the live backend/uploads/machines/ directory first.
-- Run in phpMyAdmin on the live database. Adds new rows only.
-- Existing slugs are skipped on rerun. Existing machines are not modified.
START TRANSACTION;

INSERT INTO machines
(name, slug, short_description, description, specifications,
 featured_image_url, is_featured, sort_order, is_active, is_delete)
SELECT
 'Challenger FY-3200ATPlus-H4 Flex Printing Machine',
 'challenger-fy-3200atplus-h4-flex-printing-machine',
 'Wide-format flex printer for banners, hoardings and large outdoor displays with bold, weather-ready colour.',
 'Our Challenger FY-3200ATPlus-H4 handles large flex jobs — shop boards, hoardings, event banners and backdrops — printing big, bright graphics that stay legible from a distance and hold up outdoors.',
 CONCAT('Wide-format flex printing', CHAR(10), 'Banners, hoardings & backdrops', CHAR(10), 'Vivid, outdoor-ready colour', CHAR(10), 'Suited for large display jobs'),
 '/uploads/machines/challenger-fy-3200atplus-h4-flex-printing-machine.png',
 1, 0, 1, 0
WHERE NOT EXISTS (
 SELECT 1 FROM machines WHERE slug = 'challenger-fy-3200atplus-h4-flex-printing-machine'
);

INSERT INTO machines
(name, slug, short_description, description, specifications,
 featured_image_url, is_featured, sort_order, is_active, is_delete)
SELECT
 'Epson SureColor S8130 Vinyl Printing Machine',
 'epson-surecolor-s8130-vinyl-printing-machine',
 'Latest 6-colour Epson eco-solvent printer for sharp, vibrant vinyl prints, stickers and signage.',
 'The Epson SureColor S8130 is our latest 6-colour eco-solvent printer for vinyl work — stickers, vehicle graphics, glass films and indoor or outdoor signage — delivering sharp detail and rich colour.',
 CONCAT('Eco-solvent 6-colour printing', CHAR(10), 'Vinyl, stickers & signage', CHAR(10), 'Sharp detail, rich colour', CHAR(10), 'Indoor & outdoor applications'),
 '/uploads/machines/epson-surecolor-s8130-vinyl-printing-machine.png',
 1, 0, 1, 0
WHERE NOT EXISTS (
 SELECT 1 FROM machines WHERE slug = 'epson-surecolor-s8130-vinyl-printing-machine'
);

COMMIT;

SELECT id, name, slug, featured_image_url, is_featured, sort_order
FROM machines ORDER BY sort_order, id;
