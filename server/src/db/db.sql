CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR (255) NOT NULL,
    role VARCHAR (50) DEFAULT 'admin',
    email VARCHAR (255) UNIQUE NOT NULL,
    password VARCHAR (255) NOT NULL
);

CREATE TABLE IF NOT EXISTS company_codes (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    group_name VARCHAR (50) UNIQUE NOT NULL,
    personal_area VARCHAR (50) UNIQUE NOT NULL,
    created_by INTEGER REFERENCES users(id),
    updated_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

CREATE TABLE IF NOT EXISTS sales_officers (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    sap_id VARCHAR (255) UNIQUE NOT NULL,
    name VARCHAR (255) NOT NULL,
    password VARCHAR (255) NOT NULL,
    company_code_id INTEGER REFERENCES company_codes(id),
    created_by INTEGER REFERENCES users(id),
    updated_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  
);



CREATE TABLE IF NOT EXISTS distributors (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    sap_id VARCHAR (255) UNIQUE NOT NULL,
    name VARCHAR (255) NOT NULL,
    sales_officer_id INTEGER REFERENCES sales_officers(id), 
    status BOOLEAN NOT NULL DEFAULT TRUE,
    created_by INTEGER REFERENCES users(id),
    updated_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  
);

CREATE TYPE hired_by_enum AS ENUM ('ps', 'ds');

CREATE TABLE IF NOT EXISTS pre_sellers (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    sap_id VARCHAR (255) UNIQUE,
    distributor_id INTEGER REFERENCES distributors(id),
    first_name VARCHAR (255) NOT NULL,
    last_name VARCHAR (255) NOT NULL,
    dob DATE NOT NULL,
    contact VARCHAR (50) NOT NULL,
    joining_date DATE NOT NULL,
    leaving_date DATE,
    rank INTEGER NOT NULL,
    replaced_to INTEGER,
    action_type VARCHAR(100) NOT NULL DEFAULT '03 - Hire (non employee worker)',
    action_reason VARCHAR(100) NOT NULL DEFAULT '01 - Initial Load',
    employee_group VARCHAR(100) NOT NULL DEFAULT '4 - Outsourced',
    employee_sub_group VARCHAR(100) NOT NULL DEFAULT 'ZM - External Contractors',
    position_no VARCHAR (255) ,
    reporting_sales_offices VARCHAR (255),
    hired_by hired_by_enum,
    created_by_user INTEGER REFERENCES users(id),
    updated_by_user INTEGER REFERENCES users(id),
    created_by_officer INTEGER REFERENCES sales_officers(id),
    updated_by_officer INTEGER REFERENCES sales_officers(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);