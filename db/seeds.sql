INSERT INTO department (name)
VALUES
  ('Service'),
  ('Sales');

INSERT INTO role (title, salary,department_id)
VALUES
  ('Service Manager', 5000, 1),
  ('Sales Manager', 5000, 2),
  ('Sales Rep', 4000, 2);