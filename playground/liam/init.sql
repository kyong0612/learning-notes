--
-- 1. 部門情報テーブル
--
CREATE TABLE departments (
    department_id    SERIAL PRIMARY KEY,
    department_name  VARCHAR(50) NOT NULL,
    department_code  VARCHAR(10) NOT NULL,
    location         VARCHAR(50),
    -- 部門名と部門コードの一意制約
    CONSTRAINT uq_department_name UNIQUE (department_name),
    CONSTRAINT uq_department_code UNIQUE (department_code)
);

--
-- 2. クライアント情報テーブル（プロジェクトの依頼元などを管理）
--
CREATE TABLE clients (
    client_id     SERIAL PRIMARY KEY,
    client_name   VARCHAR(100) NOT NULL,
    contact_email VARCHAR(100) NOT NULL UNIQUE
);

--
-- 3. 従業員情報テーブル（部門・マネージャ自己参照）
--
CREATE TABLE employees (
    employee_id  SERIAL PRIMARY KEY,
    first_name   VARCHAR(50) NOT NULL,
    last_name    VARCHAR(50) NOT NULL,
    email        VARCHAR(100) NOT NULL,
    hire_date    DATE NOT NULL DEFAULT CURRENT_DATE,
    salary       NUMERIC(10,2) NOT NULL DEFAULT 3000.00,
    department_id INT NOT NULL,
    manager_id    INT,
    -- 給与が正の数値であることを保証
    CONSTRAINT chk_salary_positive CHECK (salary > 0),
    -- email の一意制約
    CONSTRAINT uq_employee_email UNIQUE (email),
    -- 部門ID外部キー
    FOREIGN KEY (department_id) REFERENCES departments(department_id),
    -- マネージャ自己参照
    FOREIGN KEY (manager_id) REFERENCES employees(employee_id)
);

--
-- 4. プロジェクト情報テーブル（クライアント参照）
--
CREATE TABLE projects (
    project_id   SERIAL PRIMARY KEY,
    project_name VARCHAR(100) NOT NULL,
    status       VARCHAR(20) NOT NULL DEFAULT 'Proposed',
    start_date   DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date     DATE,
    client_id    INT NOT NULL,
    -- プロジェクトのステータスをチェック制約で限定
    CONSTRAINT chk_project_status CHECK (status IN ('Proposed','Active','Completed')),
    FOREIGN KEY (client_id) REFERENCES clients(client_id)
);

--
-- 5. 従業員とプロジェクトの多対多を表す中間テーブル
--
CREATE TABLE employee_projects (
    employee_id INT NOT NULL,
    project_id  INT NOT NULL,
    PRIMARY KEY (employee_id, project_id),
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id),
    FOREIGN KEY (project_id)  REFERENCES projects(project_id)
);

--
-- 6. タスク情報テーブル（プロジェクトに紐づくタスク、担当者は従業員）
--
CREATE TABLE tasks (
    task_id     SERIAL PRIMARY KEY,
    task_name   VARCHAR(100) NOT NULL,
    due_date    DATE,
    priority    VARCHAR(10) NOT NULL DEFAULT 'Medium',
    project_id  INT NOT NULL,
    assigned_to INT,
    -- タスクの優先度をチェック制約で限定
    CONSTRAINT chk_priority CHECK (priority IN ('Low','Medium','High')),
    FOREIGN KEY (project_id) REFERENCES projects(project_id),
    FOREIGN KEY (assigned_to) REFERENCES employees(employee_id)
);

--
-- 7. ジョブ履歴テーブル（従業員が在籍した部門の履歴などを追跡）
--
CREATE TABLE job_history (
    employee_id   INT NOT NULL,
    department_id INT NOT NULL,
    start_date    DATE NOT NULL,
    end_date      DATE,
    PRIMARY KEY (employee_id, department_id, start_date),
    FOREIGN KEY (employee_id)   REFERENCES employees(employee_id),
    FOREIGN KEY (department_id) REFERENCES departments(department_id)
);

-- ============================================
-- 以下、サンプルの初期データ投入
-- ============================================

--
-- データ投入順:
-- 1. 部門 -> 2. クライアント -> 3. 従業員 -> 4. プロジェクト
-- 5. 中間テーブル(employee_projects) -> 6. タスク -> 7. ジョブ履歴
--

-- 1. 部門情報を挿入
INSERT INTO departments (department_name, department_code, location)
VALUES
    ('Engineering', 'ENG', 'San Francisco'),
    ('Marketing',   'MKT', 'New York'),
    ('HR',          'HRD', 'Chicago');

-- 2. クライアント情報を挿入
INSERT INTO clients (client_name, contact_email)
VALUES
    ('SpaceX Partners',   'contact@spacexpartners.com'),
    ('Brandify Agency',   'info@brandify.com'),
    ('Onboarding Corp',   'hr@onboardingcorp.net');

-- 3. 従業員情報を挿入
--    ここでは、一旦 manager_id は全員 NULL で挿入 → 後ほど UPDATE で一部マネージャを設定する
INSERT INTO employees (first_name, last_name, email, department_id, salary, hire_date, manager_id)
VALUES
    ('Alice', 'Wang', 'alice.wang@example.com', 1, 7000.00, '2019-07-20', NULL),
    ('John',  'Doe',  'john.doe@example.com',   1, 6000.00, '2020-01-15', NULL),
    ('Jane',  'Smith','jane.smith@example.com', 2, 4500.00, '2021-05-10', NULL),
    ('Bob',   'Johnson','bob.johnson@example.com',3,4000.00,'2022-03-01',NULL);

-- マネージャ自己参照を設定
-- 例: John (employee_id=2) のマネージャを Alice (employee_id=1) にする
UPDATE employees
   SET manager_id = 1
 WHERE employee_id = 2;

-- 4. プロジェクト情報を挿入 (クライアント参照)
--    デフォルトステータスは 'Proposed'。状況に応じて変更してみる
INSERT INTO projects (project_name, status, start_date, end_date, client_id)
VALUES
    ('Project Apollo',      'Active',    '2023-01-01', '2023-06-30', 1), -- client_id=1 => SpaceX Partners
    ('Brand Redesign',      'Active',    '2023-02-15', NULL,        2), -- client_id=2 => Brandify Agency
    ('HR Onboarding Revamp','Proposed',  '2023-03-01', '2023-04-30',3); -- client_id=3 => Onboarding Corp

-- 5. 従業員とプロジェクトの多対多を紐づけ
INSERT INTO employee_projects (employee_id, project_id)
VALUES
    (2, 1),  -- John -> Project Apollo
    (3, 2),  -- Jane -> Brand Redesign
    (4, 3),  -- Bob  -> HR Onboarding Revamp
    (2, 2),  -- John -> Brand Redesign (兼務)
    (1, 1);  -- Alice -> Project Apollo (兼務)

-- 6. タスク情報を挿入 (priority に Low / Medium / High)
INSERT INTO tasks (task_name, due_date, priority, project_id, assigned_to)
VALUES
    ('Design rocket prototype',     '2023-02-15', 'High',   1, 2), -- John
    ('Review rocket engine specs',  '2023-03-01', 'High',   1, 1), -- Alice
    ('Develop marketing strategy',  '2023-03-01', 'Medium', 2, 3), -- Jane
    ('Update onboarding documents', '2023-03-15', 'Low',    3, 4); -- Bob

-- 7. ジョブ履歴を挿入 (従業員が所属していた部門の履歴)
--    例: Alice が 2019-07-20 に Engineering 入社、John が 2020-01-15 に同部門へ入社 ...
INSERT INTO job_history (employee_id, department_id, start_date, end_date)
VALUES
    (1, 1, '2019-07-20', NULL),    -- Alice, Engineering
    (2, 1, '2020-01-15', NULL),    -- John, Engineering
    (3, 2, '2021-05-10', NULL),    -- Jane, Marketing
    (4, 3, '2022-03-01', NULL);    -- Bob, HR
