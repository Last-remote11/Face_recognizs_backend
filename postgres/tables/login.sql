BEGIN TRANSACTION;

CREATE TABLE login
(
    id SERIAL NOT NULL,
    hash character varying(100) NOT NULL,
    email text NOT NULL,
    CONSTRAINT login_pkey PRIMARY KEY (id),
    CONSTRAINT login_email_key UNIQUE (email)
);

COMMIT;