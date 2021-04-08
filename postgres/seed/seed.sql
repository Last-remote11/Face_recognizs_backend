BEGIN TRANSACTION;

INSERT into users (name, email, entries, joined) values ('coco', 'coco@gmail.com', 0, '2018-01-01');
INSERT into login (hash, email) values ('a1oi2niqih192', 'coco@gmail.com');


COMMIT;