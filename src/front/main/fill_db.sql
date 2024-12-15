
INSERT INTO users (name, surname, status)
VALUES 
('Misha', 'Litvin', 'worker'),
('Vladimir', 'Putin', 'seller'),
('Podpolkovnik', 'Balmasov', 'admin');

INSERT INTO details (vin, name, amount)
VALUES 
('A12345678901234567', 'Engine', 100),
('B23456789012345678', 'Transmission', 150),
('C34567890123456789', 'Turbocharger', 50);

INSERT INTO purchases (vin, price, amount, name, add_to_shop_date)
VALUES 
('A12345678901234567', 1000, 5, 'Engine', '2023-01-01'),
('B23456789012345678', 800, 10, 'Transmission', '2023-02-01'),
('C34567890123456789', 200, 3, 'Turbocharger', '2023-03-01');

INSERT INTO sells (vin, amount, sell_from_shop_date, price, seller, who_added)
VALUES 
('A12345678901234567', 2, '2023-04-01', 500, 'Shop1', 1),
('B23456789012345678', 5, '2023-05-01', 400, 'Shop2', 2),
('C34567890123456789', 1, '2023-06-01', 150, 'Shop3', 1);

INSERT INTO returns (vin, amount, sell_date, return_date, to_seller, price, comment, who_added)
VALUES 
('A12345678901234567', 1, '2023-07-01', '2023-08-01', 'Customer1', 250, 'Defective engine', 1),
('B23456789012345678', 3, '2023-09-01', '2023-10-01', 'Customer2', 240, 'Not needed anymore', 2);

INSERT INTO air_returns (vin, amount, sell_date, return_date, to_seller, price, another_shop, comment, who_added)
VALUES 
('C34567890123456789', 1, '2023-11-01', '2023-12-01', 'Customer3', 150, 'Another shop', 'Not satisfied with performance', 1);
