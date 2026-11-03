-- ConectaDoa · schema.sql
-- Recria o banco do zero. Atenção: apaga os dados que já existirem.
SET NAMES utf8mb4;
DROP DATABASE IF EXISTS ongunidos;
CREATE DATABASE conectadoa CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE conectadoa;
CREATE TABLE doador (
 id_doador INT AUTO_INCREMENT PRIMARY KEY,
 nome VARCHAR(150) NOT NULL,
 email VARCHAR(100) UNIQUE,
 telefone VARCHAR(20),
 data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE categoria (
 id_categoria INT AUTO_INCREMENT PRIMARY KEY,
 nome VARCHAR(60) NOT NULL UNIQUE
);
CREATE TABLE item (
 id_item INT AUTO_INCREMENT PRIMARY KEY,
 id_categoria INT NOT NULL,
 nome VARCHAR(150) NOT NULL,
 unidade VARCHAR(20) NOT NULL DEFAULT 'unidade',
 FOREIGN KEY (id_categoria) REFERENCES categoria (id_categoria)
);
CREATE TABLE doacao (
 id_doacao INT AUTO_INCREMENT PRIMARY KEY,
 id_doador INT NOT NULL,
 data_doacao DATE NOT NULL,
 observacao VARCHAR(255),
 criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY (id_doador) REFERENCES doador (id_doador)
);
CREATE TABLE doacao_item (
 id_doacao INT NOT NULL,
 id_item INT NOT NULL,
 quantidade INT NOT NULL CHECK (quantidade > 0),
PIE II · Aula 2 · Material de Apoio · 3
 PRIMARY KEY (id_doacao, id_item),
 FOREIGN KEY (id_doacao) REFERENCES doacao (id_doacao) ON DELETE CASCADE,
 FOREIGN KEY (id_item) REFERENCES item (id_item)
);