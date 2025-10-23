

exports.up = function(knex){
    return knex.raw(
        `
        CREATE TABLE IF NOT EXISTS doctors (
            doctor_id bigserial,
            first_name VARCHAR, 
            last_name VARCHAR, 
            specialty VARCHAR,
            office VARCHAR,
            email VARCHAR,
            created_at timestamptz,
            updated_at timestamptz,
            PRIMARY key(doctor_id)
        );
        
        CREATE TABLE IF NOT EXISTS patients (
            patient_id bigserial,
            first_name VARCHAR, 
            last_name VARCHAR, 
            identification VARCHAR UNIQUE,
            phone_number INT,
            created_at timestamptz,
            updated_at timestamptz,
            PRIMARY key(patient_id)
        );
        
        CREATE TABLE IF NOT EXISTS appointments (
            appointment_id bigserial,
            schedule VARCHAR,
            specialty VARCHAR,
            doctor_id BIGINT,
            patient_identification VARCHAR,
            created_at timestamptz,
            updated_at timestamptz,
            PRIMARY key(appointment_id),
            CONSTRAINT fk_doctors
            FOREIGN KEY (doctor_id)
            REFERENCES doctors(doctor_id),
            CONSTRAINT fk_patients
            FOREIGN KEY (patient_identification)
            REFERENCES patients(identification)
        );
        `
    )
};

exports.down = function(knex) {
    return knex.raw(
        `
        DROP TABLE doctors;
        DROP TABLE patients;
        DROP TABLE appointments;
        `
    )
};
