-- ConectaDoa · seed.sql
-- Dados de exemplo. Rode depois do schema.sql.
SET NAMES utf8mb4;
USE conectadoa;
INSERT INTO categoria (nome) VALUES
 ('Alimento'),
 ('Higiene'),
 ('Vestuário');
INSERT INTO item (id_categoria, nome, unidade) VALUES
 (1, 'Arroz 5 kg', 'pacote'),
 (1, 'Feijão 1 kg', 'pacote'),
 (1, 'Óleo de soja 900 ml', 'garrafa'),
 (1, 'Leite em pó 400 g', 'lata'),
 (2, 'Sabonete', 'unidade'),
 (2, 'Creme dental', 'unidade'),
 (2, 'Fralda infantil', 'pacote'),
PIE II · Aula 2 · Material de Apoio · 4
 (3, 'Agasalho', 'peça'),
 (3, 'Cobertor', 'unidade');
INSERT INTO doador (nome, email, telefone) VALUES
 ('Mercado Bom Preço', 'contato@bompreco.exemplo.com', '(11) 3333-1000'),
 ('Ana Souza', 'ana.souza@exemplo.com', '(11) 98888-1001'),
 ('Carlos Lima', NULL, '(11) 97777-1002'),
 ('Paróquia São José', 'secretaria@psaojose.exemplo.com', NULL);
INSERT INTO doacao (id_doador, data_doacao, observacao) VALUES
 (1, '2026-10-05', 'Entrega feita pelo próprio mercado'),
 (2, '2026-10-12', NULL),
 (4, '2026-10-18', 'Campanha do agasalho');
INSERT INTO doacao_item (id_doacao, id_item, quantidade) VALUES
 (1, 1, 10),
 (1, 2, 15),
 (1, 3, 8),
 (2, 5, 12),
 (2, 6, 12),
 (3, 8, 20),
 (3, 9, 6);