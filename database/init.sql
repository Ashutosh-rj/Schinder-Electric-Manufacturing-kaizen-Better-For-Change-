-- ═══════════════════════════════════════════════════════════════════
--  KAIZEN — Database Initialization
--  PostgreSQL + TimescaleDB
-- ═══════════════════════════════════════════════════════════════════

-- Enable TimescaleDB extension
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- ─── PLANT HIERARCHY ────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS plants (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(200) NOT NULL,
    code        VARCHAR(50)  NOT NULL UNIQUE,
    location    VARCHAR(200),
    capacity_tpd FLOAT,        -- tons per day clinker
    description TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS areas (
    id          SERIAL PRIMARY KEY,
    plant_id    INTEGER REFERENCES plants(id) ON DELETE CASCADE,
    name        VARCHAR(200) NOT NULL,
    code        VARCHAR(50)  NOT NULL,
    description TEXT,
    sort_order  INTEGER DEFAULT 0,
    UNIQUE(plant_id, code)
);

CREATE TABLE IF NOT EXISTS departments (
    id          SERIAL PRIMARY KEY,
    area_id     INTEGER REFERENCES areas(id) ON DELETE CASCADE,
    name        VARCHAR(200) NOT NULL,
    code        VARCHAR(50)  NOT NULL,
    description TEXT,
    sort_order  INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS equipment_types (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    code        VARCHAR(50)  NOT NULL UNIQUE,
    category    VARCHAR(50),    -- motor, fan, mill, kiln, pump, etc.
    description TEXT
);

CREATE TABLE IF NOT EXISTS equipment (
    id              SERIAL PRIMARY KEY,
    department_id   INTEGER REFERENCES departments(id) ON DELETE CASCADE,
    equipment_type_id INTEGER REFERENCES equipment_types(id),
    name            VARCHAR(200) NOT NULL,
    code            VARCHAR(50)  NOT NULL UNIQUE,
    tag             VARCHAR(100),
    manufacturer    VARCHAR(100),
    model           VARCHAR(100),
    rated_power_kw  FLOAT,
    rated_speed_rpm FLOAT,
    status          VARCHAR(20) DEFAULT 'running',  -- running, stopped, maintenance, fault
    health_score    FLOAT DEFAULT 100.0,
    description     TEXT,
    installed_at    DATE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_equipment_department ON equipment(department_id);
CREATE INDEX IF NOT EXISTS idx_equipment_status ON equipment(status);

-- ─── SENSORS ────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS sensors (
    id              SERIAL PRIMARY KEY,
    equipment_id    INTEGER REFERENCES equipment(id) ON DELETE CASCADE,
    name            VARCHAR(200) NOT NULL,
    tag             VARCHAR(100) NOT NULL UNIQUE,
    parameter       VARCHAR(100) NOT NULL,   -- temperature, pressure, power, vibration...
    unit            VARCHAR(30)  NOT NULL,
    min_range       FLOAT,
    max_range       FLOAT,
    alarm_low       FLOAT,
    alarm_high      FLOAT,
    alarm_low_low   FLOAT,
    alarm_high_high FLOAT,
    description     TEXT,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sensors_equipment ON sensors(equipment_id);
CREATE INDEX IF NOT EXISTS idx_sensors_tag ON sensors(tag);

-- ─── TIME SERIES (TimescaleDB) ──────────────────────────────────

CREATE TABLE IF NOT EXISTS sensor_readings (
    time            TIMESTAMPTZ NOT NULL,
    sensor_id       INTEGER     NOT NULL REFERENCES sensors(id),
    value           DOUBLE PRECISION,
    quality         VARCHAR(20) DEFAULT 'GOOD',  -- GOOD, STALE, MISSING, SUSPECT, OUT_OF_RANGE
    source          VARCHAR(20) DEFAULT 'simulator'
);

SELECT create_hypertable('sensor_readings', 'time', if_not_exists => TRUE);
CREATE INDEX IF NOT EXISTS idx_sr_sensor_time ON sensor_readings(sensor_id, time DESC);

CREATE TABLE IF NOT EXISTS energy_readings (
    time                TIMESTAMPTZ NOT NULL,
    equipment_id        INTEGER REFERENCES equipment(id),
    department_code     VARCHAR(50),
    total_power_kw      DOUBLE PRECISION,
    active_energy_kwh   DOUBLE PRECISION,
    reactive_power_kvar DOUBLE PRECISION,
    power_factor        DOUBLE PRECISION,
    voltage_v           DOUBLE PRECISION,
    current_a           DOUBLE PRECISION,
    source              VARCHAR(20) DEFAULT 'simulator'
);

SELECT create_hypertable('energy_readings', 'time', if_not_exists => TRUE);
CREATE INDEX IF NOT EXISTS idx_er_equip_time ON energy_readings(equipment_id, time DESC);
CREATE INDEX IF NOT EXISTS idx_er_dept_time ON energy_readings(department_code, time DESC);

CREATE TABLE IF NOT EXISTS production_records (
    time                TIMESTAMPTZ NOT NULL,
    department_code     VARCHAR(50),
    product             VARCHAR(50),  -- clinker, cement, raw_meal
    production_tph      DOUBLE PRECISION,  -- tons per hour
    cumulative_tons     DOUBLE PRECISION,
    specific_energy     DOUBLE PRECISION,  -- kWh/ton
    target_tph          DOUBLE PRECISION,
    quality_score       DOUBLE PRECISION
);

SELECT create_hypertable('production_records', 'time', if_not_exists => TRUE);
CREATE INDEX IF NOT EXISTS idx_pr_dept_time ON production_records(department_code, time DESC);

-- ─── ALARMS ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS alarms (
    id              SERIAL PRIMARY KEY,
    sensor_id       INTEGER REFERENCES sensors(id),
    equipment_id    INTEGER REFERENCES equipment(id),
    department_code VARCHAR(50),
    alarm_tag       VARCHAR(100) NOT NULL,
    description     TEXT,
    priority        VARCHAR(20) DEFAULT 'MEDIUM',  -- CRITICAL, HIGH, MEDIUM, LOW, INFO
    category        VARCHAR(50),
    value           DOUBLE PRECISION,
    limit_value     DOUBLE PRECISION,
    state           VARCHAR(20) DEFAULT 'ACTIVE',  -- ACTIVE, ACKNOWLEDGED, CLEARED
    raised_at       TIMESTAMPTZ DEFAULT NOW(),
    acknowledged_at TIMESTAMPTZ,
    acknowledged_by VARCHAR(100),
    cleared_at      TIMESTAMPTZ,
    notes           TEXT
);

CREATE INDEX IF NOT EXISTS idx_alarms_state ON alarms(state);
CREATE INDEX IF NOT EXISTS idx_alarms_priority ON alarms(priority);
CREATE INDEX IF NOT EXISTS idx_alarms_dept ON alarms(department_code);
CREATE INDEX IF NOT EXISTS idx_alarms_raised ON alarms(raised_at DESC);

-- ─── MAINTENANCE ────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS maintenance_records (
    id              SERIAL PRIMARY KEY,
    equipment_id    INTEGER REFERENCES equipment(id) ON DELETE CASCADE,
    type            VARCHAR(50),   -- preventive, corrective, predictive
    description     TEXT,
    status          VARCHAR(30) DEFAULT 'planned',  -- planned, in_progress, completed
    scheduled_at    TIMESTAMPTZ,
    started_at      TIMESTAMPTZ,
    completed_at    TIMESTAMPTZ,
    technician      VARCHAR(100),
    notes           TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── ML MODELS ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS model_registry (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,
    version         VARCHAR(30)  NOT NULL,
    model_type      VARCHAR(50),   -- anomaly, health, failure, energy, process
    target          VARCHAR(50),   -- kiln, cement_mill, fan, ...
    metrics         JSONB,
    features        JSONB,
    training_data_from TIMESTAMPTZ,
    training_data_to   TIMESTAMPTZ,
    artifact_path   VARCHAR(500),
    is_active       BOOLEAN DEFAULT FALSE,
    trained_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(name, version)
);

CREATE TABLE IF NOT EXISTS predictions (
    id              SERIAL PRIMARY KEY,
    model_id        INTEGER REFERENCES model_registry(id),
    equipment_id    INTEGER REFERENCES equipment(id),
    prediction_type VARCHAR(50),   -- health_score, failure_risk, energy_forecast
    value           DOUBLE PRECISION,
    confidence      DOUBLE PRECISION,
    features_used   JSONB,
    shap_values     JSONB,
    predicted_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_predictions_equip ON predictions(equipment_id, predicted_at DESC);

-- ─── OPTIMIZATION ────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS optimization_runs (
    id              SERIAL PRIMARY KEY,
    run_type        VARCHAR(50),   -- kiln, raw_mill, cement_mill, energy_mix
    status          VARCHAR(30) DEFAULT 'pending',
    inputs          JSONB,
    constraints     JSONB,
    result          JSONB,
    objective_value DOUBLE PRECISION,
    iterations      INTEGER,
    converged       BOOLEAN,
    run_at          TIMESTAMPTZ DEFAULT NOW(),
    run_by          VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS simulation_runs (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(200),
    description     TEXT,
    parameters      JSONB,
    baseline_state  JSONB,
    simulated_state JSONB,
    delta           JSONB,
    status          VARCHAR(30) DEFAULT 'completed',
    run_at          TIMESTAMPTZ DEFAULT NOW(),
    run_by          VARCHAR(100)
);

-- ─── RECOMMENDATIONS ────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS recommendations (
    id              SERIAL PRIMARY KEY,
    rec_id          VARCHAR(50) NOT NULL UNIQUE,  -- e.g. REC-2024-001
    equipment_id    INTEGER REFERENCES equipment(id),
    department_code VARCHAR(50),
    category        VARCHAR(50),   -- energy, maintenance, quality, production
    title           VARCHAR(300),
    description     TEXT,
    current_value   JSONB,
    recommended_value JSONB,
    expected_benefit JSONB,
    confidence      DOUBLE PRECISION,
    constraints     JSONB,
    reason          TEXT,
    expected_risk   TEXT,
    rollback_option TEXT,
    status          VARCHAR(30) DEFAULT 'DETECTED',
    -- DETECTED, ANALYZED, RECOMMENDED, PENDING_APPROVAL, APPROVED, IMPLEMENTED, VERIFIED, CLOSED, REJECTED
    priority        VARCHAR(20) DEFAULT 'MEDIUM',
    model_version   VARCHAR(30),
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW(),
    approved_by     VARCHAR(100),
    approved_at     TIMESTAMPTZ,
    rejection_reason TEXT
);

CREATE INDEX IF NOT EXISTS idx_rec_status ON recommendations(status);
CREATE INDEX IF NOT EXISTS idx_rec_dept ON recommendations(department_code);

-- ─── KAIZEN OPPORTUNITIES ────────────────────────────────────────

CREATE TABLE IF NOT EXISTS kaizen_opportunities (
    id                      SERIAL PRIMARY KEY,
    opp_id                  VARCHAR(50) NOT NULL UNIQUE,  -- KAI-2024-001
    department_code         VARCHAR(50),
    equipment_id            INTEGER REFERENCES equipment(id),
    title                   VARCHAR(300),
    problem                 TEXT,
    root_cause              TEXT,
    current_performance     JSONB,
    target_performance      JSONB,
    potential_energy_saving_kwh_day DOUBLE PRECISION,
    potential_cost_saving_day       DOUBLE PRECISION,
    potential_co2_reduction_tday    DOUBLE PRECISION,
    implementation_difficulty       VARCHAR(20) DEFAULT 'MEDIUM',  -- LOW, MEDIUM, HIGH
    estimated_roi_days      INTEGER,
    confidence              DOUBLE PRECISION,
    priority_score          DOUBLE PRECISION,
    priority                VARCHAR(20) DEFAULT 'MEDIUM',
    status                  VARCHAR(30) DEFAULT 'OPEN',  -- OPEN, IN_PROGRESS, CLOSED, DISMISSED
    recommendation_id       INTEGER REFERENCES recommendations(id),
    created_at              TIMESTAMPTZ DEFAULT NOW(),
    closed_at               TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_kaizen_status ON kaizen_opportunities(status);
CREATE INDEX IF NOT EXISTS idx_kaizen_priority ON kaizen_opportunities(priority_score DESC);

-- ─── SAVINGS VERIFICATION ────────────────────────────────────────

CREATE TABLE IF NOT EXISTS savings_verification (
    id                  SERIAL PRIMARY KEY,
    kaizen_id           INTEGER REFERENCES kaizen_opportunities(id),
    recommendation_id   INTEGER REFERENCES recommendations(id),
    baseline_from       TIMESTAMPTZ,
    baseline_to         TIMESTAMPTZ,
    post_intervention_from TIMESTAMPTZ,
    post_intervention_to   TIMESTAMPTZ,
    baseline_energy_kwh     DOUBLE PRECISION,
    post_energy_kwh         DOUBLE PRECISION,
    actual_energy_saving    DOUBLE PRECISION,
    baseline_production_ton DOUBLE PRECISION,
    post_production_ton     DOUBLE PRECISION,
    actual_sec_before       DOUBLE PRECISION,
    actual_sec_after        DOUBLE PRECISION,
    actual_co2_reduction    DOUBLE PRECISION,
    financial_saving        DOUBLE PRECISION,
    verified_at             TIMESTAMPTZ DEFAULT NOW(),
    verified_by             VARCHAR(100),
    notes                   TEXT
);

-- ─── USERS & AUTH ────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS roles (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    permissions JSONB
);

CREATE TABLE IF NOT EXISTS users (
    id              SERIAL PRIMARY KEY,
    email           VARCHAR(255) NOT NULL UNIQUE,
    username        VARCHAR(100) NOT NULL UNIQUE,
    full_name       VARCHAR(200),
    hashed_password VARCHAR(500) NOT NULL,
    role_id         INTEGER REFERENCES roles(id),
    department      VARCHAR(100),
    is_active       BOOLEAN DEFAULT TRUE,
    last_login      TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER REFERENCES users(id),
    action          VARCHAR(100),
    resource        VARCHAR(100),
    resource_id     INTEGER,
    details         JSONB,
    ip_address      VARCHAR(50),
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_logs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_resource ON audit_logs(resource, resource_id);

-- ─── SEED BASE DATA ──────────────────────────────────────────────

INSERT INTO roles (name, description, permissions) VALUES
  ('admin',          'System Administrator',  '{"all": true}'::jsonb),
  ('plant_manager',  'Plant Manager',         '{"read": true, "approve": true}'::jsonb),
  ('shift_engineer', 'Shift Engineer',        '{"read": true, "recommend": true}'::jsonb),
  ('operator',       'Operator',              '{"read": true, "acknowledge": true}'::jsonb),
  ('energy_manager', 'Energy Manager',        '{"read": true, "energy": true}'::jsonb),
  ('maintenance',    'Maintenance Engineer',  '{"read": true, "maintenance": true}'::jsonb)
ON CONFLICT (name) DO NOTHING;

-- Default admin user (password: kaizen123)
-- hashed with bcrypt
INSERT INTO users (email, username, full_name, hashed_password, role_id)
VALUES (
    'admin@kaizen.io',
    'admin',
    'KAIZEN Administrator',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3oW3E2ldBO',
    (SELECT id FROM roles WHERE name = 'admin')
) ON CONFLICT (email) DO NOTHING;

INSERT INTO users (email, username, full_name, hashed_password, role_id)
VALUES (
    'operator@kaizen.io',
    'operator1',
    'Plant Operator',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3oW3E2ldBO',
    (SELECT id FROM roles WHERE name = 'operator')
) ON CONFLICT (email) DO NOTHING;

INSERT INTO users (email, username, full_name, hashed_password, role_id)
VALUES (
    'manager@kaizen.io',
    'manager1',
    'Plant Manager',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3oW3E2ldBO',
    (SELECT id FROM roles WHERE name = 'plant_manager')
) ON CONFLICT (email) DO NOTHING;


-- ─── ADDED FROM TASK 1 ────────────────────────────────────────────

-- downtime_records table
CREATE TABLE IF NOT EXISTS downtime_records (
    id SERIAL PRIMARY KEY,
    equipment_id INTEGER REFERENCES equipment(id),
    department_code VARCHAR(50),
    category VARCHAR(50), -- MECHANICAL, ELECTRICAL, INSTRUMENTATION, PROCESS, RAW_MATERIAL, QUALITY, OPERATIONAL, EXTERNAL, PLANNED
    description TEXT,
    started_at TIMESTAMPTZ NOT NULL,
    ended_at TIMESTAMPTZ,
    duration_minutes FLOAT,
    production_loss_tons FLOAT,
    energy_impact_kwh FLOAT,
    reported_by VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- shift_reports table
CREATE TABLE IF NOT EXISTS shift_reports (
    id SERIAL PRIMARY KEY,
    shift_date DATE NOT NULL,
    shift_name VARCHAR(10) NOT NULL, -- A, B, C
    department_code VARCHAR(50),
    production_tons FLOAT,
    energy_kwh FLOAT,
    sec_kwh_ton FLOAT,
    downtime_minutes FLOAT,
    major_alarms INTEGER,
    trips INTEGER,
    availability_pct FLOAT,
    quality_score FLOAT,
    operator_remarks TEXT,
    maintenance_remarks TEXT,
    process_abnormalities TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(shift_date, shift_name, department_code)
);

-- daily_reports table  
CREATE TABLE IF NOT EXISTS daily_reports (
    id SERIAL PRIMARY KEY,
    report_date DATE NOT NULL UNIQUE,
    clinker_production_tons FLOAT,
    cement_production_tons FLOAT,
    raw_meal_production_tons FLOAT,
    dispatch_tons FLOAT,
    availability_pct FLOAT,
    total_downtime_minutes FLOAT,
    electrical_energy_kwh FLOAT,
    thermal_energy_kcal_kg_clinker FLOAT,
    sec_kwh_ton_clinker FLOAT,
    sec_kwh_ton_cement FLOAT,
    fuel_consumption_tons FLOAT,
    whrs_generation_kwh FLOAT,
    cpp_generation_kwh FLOAT,
    grid_import_kwh FLOAT,
    co2_intensity_kg_ton FLOAT,
    raw_mill_production_tons FLOAT,
    coal_mill_production_tons FLOAT,
    kiln_production_tons FLOAT,
    kiln_run_factor_pct FLOAT,
    cement_mill_production_tons FLOAT,
    free_lime_avg FLOAT,
    blaine_avg FLOAT,
    major_breakdowns TEXT,
    major_alarms TEXT,
    top_losses TEXT,
    corrective_actions TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- quality_lab_results table
CREATE TABLE IF NOT EXISTS quality_lab_results (
    id SERIAL PRIMARY KEY,
    sample_time TIMESTAMPTZ NOT NULL,
    sample_type VARCHAR(50), -- RAW_MEAL, CLINKER, CEMENT, COAL
    lsf FLOAT, -- Lime Saturation Factor
    sm FLOAT,  -- Silica Modulus
    am FLOAT,  -- Alumina Modulus
    residue_90um_pct FLOAT,
    residue_212um_pct FLOAT,
    free_lime_pct FLOAT,
    c3s_pct FLOAT,
    c2s_pct FLOAT,
    c3a_pct FLOAT,
    c4af_pct FLOAT,
    blaine_cm2g FLOAT,
    strength_1d_mpa FLOAT,
    strength_3d_mpa FLOAT,
    strength_28d_mpa FLOAT,
    so3_pct FLOAT,
    moisture_pct FLOAT,
    ash_pct FLOAT,
    volatile_matter_pct FLOAT,
    gcv_kcal_kg FLOAT,
    lab_tech VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- operating_windows table (configurable envelopes)
CREATE TABLE IF NOT EXISTS operating_windows (
    id SERIAL PRIMARY KEY,
    equipment_code VARCHAR(50) NOT NULL,
    parameter VARCHAR(100) NOT NULL,
    unit VARCHAR(30),
    op_low FLOAT,
    op_high FLOAT,
    target FLOAT,
    best_achieved FLOAT,
    source VARCHAR(100) DEFAULT 'engineering_standard', -- oem, dcs, plant_procedure, engineering_standard
    notes TEXT,
    updated_by VARCHAR(100),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(equipment_code, parameter)
);

-- equipment_health_history (time-series)
CREATE TABLE IF NOT EXISTS equipment_health_history (
    time TIMESTAMPTZ NOT NULL,
    equipment_id INTEGER REFERENCES equipment(id),
    health_score FLOAT,
    vibration_score FLOAT,
    thermal_score FLOAT,
    electrical_score FLOAT,
    lubrication_score FLOAT,
    contributing_factors JSONB,
    status VARCHAR(20) DEFAULT 'NORMAL' -- NORMAL, WARNING, DEGRADING, HIGH_RISK, CRITICAL
);
SELECT create_hypertable('equipment_health_history', 'time', if_not_exists => TRUE);

-- anomaly_detections table
CREATE TABLE IF NOT EXISTS anomaly_detections (
    id SERIAL PRIMARY KEY,
    detected_at TIMESTAMPTZ NOT NULL,
    equipment_id INTEGER REFERENCES equipment(id),
    sensor_tag VARCHAR(100),
    department_code VARCHAR(50),
    anomaly_type VARCHAR(50), -- STATISTICAL, RATE_OF_CHANGE, FROZEN, ENVELOPE, MULTIVARIATE
    parameter VARCHAR(100),
    normal_range_low FLOAT,
    normal_range_high FLOAT,
    current_value FLOAT,
    deviation_sigma FLOAT,
    severity VARCHAR(20) DEFAULT 'MEDIUM', -- LOW, MEDIUM, HIGH, CRITICAL
    possible_cause TEXT,
    recommended_action TEXT,
    acknowledged BOOLEAN DEFAULT FALSE,
    acknowledged_by VARCHAR(100),
    acknowledged_at TIMESTAMPTZ,
    auto_cleared BOOLEAN DEFAULT FALSE,
    cleared_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_anomaly_dept ON anomaly_detections(department_code, detected_at DESC);

-- rca_results table
CREATE TABLE IF NOT EXISTS rca_results (
    id SERIAL PRIMARY KEY,
    analyzed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deviation_type VARCHAR(100),
    department_code VARCHAR(50),
    equipment_id INTEGER REFERENCES equipment(id),
    symptoms JSONB,
    causes JSONB,  -- array of {root_cause, probability, evidence, affected_tags, recommended_check}
    top_cause TEXT,
    top_probability FLOAT,
    event_timeline JSONB,
    status VARCHAR(30) DEFAULT 'OPEN', -- OPEN, INVESTIGATED, RESOLVED
    resolved_by VARCHAR(100),
    resolution_notes TEXT
);

-- event_timeline table
CREATE TABLE IF NOT EXISTS event_timeline (
    id SERIAL,
    event_time TIMESTAMPTZ NOT NULL,
    event_type VARCHAR(50), -- ALARM, TRIP, SETPOINT_CHANGE, OPERATOR_ACTION, PROCESS_DEVIATION
    department_code VARCHAR(50),
    equipment_id INTEGER REFERENCES equipment(id),
    sensor_tag VARCHAR(100),
    description TEXT,
    value_before FLOAT,
    value_after FLOAT,
    operator_id INTEGER REFERENCES users(id),
    is_cause BOOLEAN DEFAULT FALSE,
    is_effect BOOLEAN DEFAULT FALSE,
    rca_id INTEGER REFERENCES rca_results(id),
    PRIMARY KEY (id, event_time)
);
SELECT create_hypertable('event_timeline', 'event_time', if_not_exists => TRUE);

-- sensor_health table (instrument intelligence)
CREATE TABLE IF NOT EXISTS sensor_health (
    time TIMESTAMPTZ NOT NULL,
    sensor_id INTEGER REFERENCES sensors(id),
    health_status VARCHAR(30) DEFAULT 'GOOD', -- GOOD, FROZEN, DRIFTING, NOISY, SIGNAL_LOSS, OUT_OF_RANGE
    frozen_duration_minutes FLOAT,
    noise_level FLOAT,
    drift_rate FLOAT,
    last_good_value FLOAT,
    flag_reason TEXT
);
SELECT create_hypertable('sensor_health', 'time', if_not_exists => TRUE);

-- SEED DATA 
INSERT INTO plants (name, code, capacity_tpd, description) VALUES ('Main Cement Plant', 'MCP', 3000.0, 'Simulated 3000 TPD Cement Plant');

INSERT INTO areas (plant_id, name, code, description, sort_order) VALUES
(1, 'Crusher', 'CRUSHER', 'Limestone Crushing', 1),
(1, 'Raw Mill', 'RAW_MILL', 'Raw Material Grinding', 2),
(1, 'Coal Mill', 'COAL_MILL', 'Coal Grinding', 3),
(1, 'Pyroprocessing', 'PYRO', 'Preheater and Kiln', 4),
(1, 'Cooler', 'COOLER', 'Clinker Cooling', 5),
(1, 'Clinker Transport', 'CLINKER_TRANSPORT', 'Clinker Transport and Storage', 6),
(1, 'Cement Mill', 'CEMENT_MILL', 'Cement Grinding', 7),
(1, 'Packing', 'PACKING', 'Cement Packing and Dispatch', 8),
(1, 'Waste Heat Recovery', 'WHRS', 'Waste Heat Recovery System', 9),
(1, 'Captive Power Plant', 'CPP', 'Captive Power Plant', 10),
(1, 'Electrical', 'ELECTRICAL', 'Main Plant Electrical System', 11);

INSERT INTO departments (area_id, name, code, description) VALUES
(1, 'Primary Crusher', 'CRUSHER_1', 'Primary Crusher'),
(2, 'Raw Mill 1', 'RM1', 'Raw Mill 1'),
(3, 'Coal Mill 1', 'CM1', 'Coal Mill 1'),
(4, 'Kiln 1', 'KILN1', 'Kiln 1'),
(4, 'Preheater 1', 'PH1', 'Preheater 1'),
(5, 'Cooler 1', 'COOLER1', 'Cooler 1'),
(7, 'Cement Mill 1', 'CMILL1', 'Cement Mill 1'),
(9, 'WHRS 1', 'WHRS1', 'WHRS 1');

INSERT INTO equipment_types (name, code, category) VALUES
('Vertical Roller Mill', 'VRM', 'mill'),
('Rotary Kiln', 'KILN', 'kiln'),
('Grate Cooler', 'COOLER', 'cooler'),
('Centrifugal Fan', 'FAN', 'fan'),
('Bucket Elevator', 'ELEVATOR', 'transport'),
('Belt Conveyor', 'CONVEYOR', 'transport'),
('Separator', 'SEPARATOR', 'separator'),
('Ball Mill', 'BALL_MILL', 'mill'),
('Preheater Cyclone', 'CYCLONE', 'cyclone');

INSERT INTO equipment (department_id, equipment_type_id, name, code, tag) VALUES
(2, 1, 'Raw Mill 1 VRM', 'RM1_VRM', 'KAIZEN.RAWMILL1.VRM501'),
(2, 4, 'Raw Mill 1 Fan', 'RM1_FAN', 'KAIZEN.RAWMILL1.FAN502'),
(2, 7, 'Raw Mill 1 Separator', 'RM1_SEP', 'KAIZEN.RAWMILL1.SEP503'),
(4, 2, 'Kiln 1', 'KILN1_MAIN', 'KAIZEN.KILN1.MAIN'),
(4, 4, 'Kiln ID Fan', 'KILN1_IDFAN', 'KAIZEN.KILN1.IDFAN'),
(5, 9, 'Preheater Cyclone Stage 1', 'PH1_CYC1', 'KAIZEN.PH1.CYC1'),
(5, 9, 'Preheater Cyclone Stage 5', 'PH1_CYC5', 'KAIZEN.PH1.CYC5'),
(6, 3, 'Grate Cooler 1', 'COOLER1_MAIN', 'KAIZEN.COOLER1.MAIN'),
(6, 4, 'Cooler Exhaust Fan', 'COOLER1_FAN', 'KAIZEN.COOLER1.FAN'),
(7, 8, 'Cement Mill 1 Ball Mill', 'CM1_MILL', 'KAIZEN.CEMENTMILL1.MILL'),
(7, 7, 'Cement Mill 1 Separator', 'CM1_SEP', 'KAIZEN.CEMENTMILL1.SEP'),
(7, 4, 'Cement Mill 1 Fan', 'CM1_FAN', 'KAIZEN.CEMENTMILL1.FAN');

-- Just a sampling of sensors for brevity and realistic structure
INSERT INTO sensors (equipment_id, name, tag, parameter, unit, min_range, max_range, alarm_low, alarm_high, alarm_low_low, alarm_high_high) VALUES
(1, 'Mill Motor Power', 'KAIZEN.RAWMILL1.VRM501.POWER', 'power', 'kW', 0, 4000, 500, 3500, 100, 3800),
(1, 'Mill DP', 'KAIZEN.RAWMILL1.VRM501.MILL.DP_MMWC', 'pressure', 'mmWC', 0, 1000, 400, 800, 300, 900),
(1, 'Mill Outlet Temp', 'KAIZEN.RAWMILL1.VRM501.TEMP.OUTLET', 'temperature', 'C', 0, 150, 75, 100, 70, 110),
(4, 'Kiln Main Drive Power', 'KAIZEN.KILN1.MAIN.POWER', 'power', 'kW', 0, 1000, 100, 800, 50, 900),
(4, 'Kiln Speed', 'KAIZEN.KILN1.MAIN.SPEED', 'speed', 'rpm', 0, 5, 1, 4.5, 0.5, 4.8),
(4, 'Kiln Burning Zone Temp', 'KAIZEN.KILN1.MAIN.BZT', 'temperature', 'C', 0, 2000, 1380, 1480, 1300, 1550),
(4, 'Kiln Exit Gas O2', 'KAIZEN.KILN1.MAIN.GAS.O2', 'concentration', '%', 0, 21, 1.5, 4, 1.0, 5.0),
(4, 'Kiln Exit Gas CO', 'KAIZEN.KILN1.MAIN.GAS.CO', 'concentration', 'ppm', 0, 2000, 0, 500, 0, 800),
(7, 'Preheater Stage 5 Exit Temp', 'KAIZEN.PH1.CYC5.TEMP.EXIT', 'temperature', 'C', 0, 1200, 800, 900, 750, 950),
(8, 'Cooler Secondary Air Temp', 'KAIZEN.COOLER1.MAIN.TEMP.SEC_AIR', 'temperature', 'C', 0, 1500, 850, 1100, 800, 1200),
(8, 'Cooler Undergrate Pressure', 'KAIZEN.COOLER1.MAIN.PRESS.UNDER', 'pressure', 'mmWC', 0, 800, 300, 600, 200, 700),
(10, 'Cement Mill Motor Power', 'KAIZEN.CEMENTMILL1.MILL.POWER', 'power', 'kW', 0, 5000, 1000, 4500, 500, 4800),
(10, 'Cement Mill DP', 'KAIZEN.CEMENTMILL1.MILL.DP', 'pressure', 'mmWC', 0, 800, 200, 500, 150, 600),
(10, 'Cement Mill Outlet Temp', 'KAIZEN.CEMENTMILL1.MILL.TEMP.OUTLET', 'temperature', 'C', 0, 150, 90, 115, 80, 125);

INSERT INTO operating_windows (equipment_code, parameter, unit, op_low, op_high, target, best_achieved) VALUES
('RM1_VRM', 'Mill DP', 'mmWC', 500, 750, 650, 620),
('RM1_VRM', 'Outlet Temp', 'C', 80, 95, 85, 82),
('KILN1_MAIN', 'Speed', 'rpm', 3.0, 4.5, 4.0, 4.2),
('KILN1_MAIN', 'Burning Zone Temp', 'C', 1380, 1480, 1450, 1460),
('COOLER1_MAIN', 'Secondary Air Temp', 'C', 900, 1100, 1050, 1080),
('CM1_MILL', 'Mill DP', 'mmWC', 300, 500, 400, 380);
