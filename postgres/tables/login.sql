BEGIN TRANSACTION;

CREATE TABLE login
(
    id integer NOT NULL DEFAULT nextval('login_id_seq'::regclass),
    hash character varying(100) COLLATE pg_catalog."default" NOT NULL,
    email text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT login_pkey PRIMARY KEY (id),
    CONSTRAINT login_email_key UNIQUE (email)
)

COMMIT;