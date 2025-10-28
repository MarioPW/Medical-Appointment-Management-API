

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
            patient_id UUID PRIMARY KEY,                   -- Change 1: bigserial → UUID
            user_id UUID NOT NULL UNIQUE,                  -- Change 2: FK to User in Auth System
            identification VARCHAR UNIQUE,                 -- Change 3: Unique identification
            first_name VARCHAR,                            -- Change 4: Fist name
            last_name VARCHAR,                             -- Change 5: Last name
            birth_date DATE,                               -- Change 6: Birth date
            phone VARCHAR,                                 -- Change 7: VARCHAR instead of INT
            health_secure_number VARCHAR,                  -- Change 8: Health secure number
            address TEXT,                                  -- Change 9: Address
            created_at TIMESTAMPTZ DEFAULT NOW(),          -- Change 10: Default NOW()
            updated_at TIMESTAMPTZ DEFAULT NOW(),
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE  -- Change 10: FK constraint
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

        -- Indexes to improve performance
        CREATE INDEX IF NOT EXISTS idx_doctors_user_id ON doctors(user_id);
        CREATE INDEX IF NOT EXISTS idx_patients_user_id ON patients(user_id);
        CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
        CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON appointments(doctor_id);
        CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
        `
    );
};

exports.down = function(knex){
    return knex.raw(
        `
        DROP TABLE IF EXISTS appointments CASCADE;
        DROP TABLE IF EXISTS doctors CASCADE;
        DROP TABLE IF EXISTS patients CASCADE;
        `
    );
};
