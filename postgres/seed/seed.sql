BEGIN TRANSACTION;

INSERT into users (name, email, entries, joined) values ('coco', 'coco@gmail.com', 0, '2018-01-01');
INSERT into login (hash, email) values ('$2y$12$hSJlUvKKX1OdVqSxf.FpD.sscfV.thni3aqeoM5BiQjeVLDDT1TyO', 'coco@gmail.com');


COMMIT;