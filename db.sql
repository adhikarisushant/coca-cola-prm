CREATE TABLE IF NOT EXISTS sales_officers (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    sap_id VARCHAR (255) UNIQUE NOT NULL,
    name VARCHAR (255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR (255) NOT NULL,
    company_code_id INTEGER REFERENCES company_codes(id) 
);

CREATE TABLE IF NOT EXISTS company_codes (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    group VARCHAR (50) UNIQUE NOT NULL,
    personal_area VARCHAR (50) UNIQUE NOT NULL,
);

CREATE TABLE IF NOT EXISTS distributors (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    sap_id VARCHAR (255) UNIQUE NOT NULL,
    name VARCHAR (255) NOT NULL,
    sales_officer_id INTEGER REFERENCES sales_officers(id) 
);

CREATE TYPE hired_by_enum AS ENUM ('company (ps)', 'distributor (ds)');

CREATE TABLE IF NOT EXISTS pre_sellers (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    distributor_id INTEGER REFERENCES distributors(id),
    first_name VARCHAR (255) NOT NULL,
    last_name VARCHAR (255) NOT NULL,
    dob DATE NOT NULL,
    contact VARCHAR (50) NOT NULL,
    joining_date DATE NOT NULL,
    leaving_date DATE,
    rank INTEGER NOT NULL,
    replaced_to INTEGER,
    action_type VARCHAR (255) NOT NULL,
    action_reason VARCHAR (255) NOT NULL,
    employee_group VARCHAR (255) NOT NULL,
    employee_sub_group VARCHAR (255) NOT NULL,
    position_no VARCHAR (255) NOT NULL,
    reporting_sales_offices VARCHAR (255) NOT NULL,
    hired_by hired_by_enum,
);