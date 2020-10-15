INSERT INTO users (
  name, email, password
)
VALUES 
('Scott Morton', 'd@s.ca', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'), 
('Paul Chen', 'p@c.van', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'), 
('Jack Morton', 'JM@m.ca', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (
  owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active
)
VALUES
(1,'the great escape', 'description','http://www.cgstock.com/7232', 'http://www.cgstock.com/7232', 200, 2, 2, 4, 'Canada', 'Maple', 'Halifax','Nova Scotia', 'B0N 2TO', 'TRUE'), 
(2,'the greatest escape', 'description','http://www.cgstock.com/694', 'http://www.cgstock.com/694', 300, 4, 4, 6, 'Canada', 'Victoria', 'Moosejaw', 'Saskatchewan', 'R0N 7X2', 'TRUE'),
(3,'the even greater escape', 'description','http://www.cgstock.com/670', 'http://www.cgstock.com/670', 500, 10, 5, 10, 'Canada', 'Main', 'Calgary', 'Alberta', 'V3N 6R2', 'TRUE');

INSERT INTO reservations (
  start_date, end_date, property_id, guest_id
)
VALUES 
('2018-09-11', '2018-09-26', 1 ,1),
('2019-01-04', '2019-02-01', 2 ,2),
('2021-10-01', '2021-10-14', 3 ,3);

INSERT INTO property_reviews (
 guest_id, 
 property_id, 
 reservation_id, 
 rating, 
 message
)
 VALUES
  (1, 1, 1, 10, 'great'),
  (2, 2, 2, 10, 'super'),
  (3, 3, 3, 10, 'clean, nice view');