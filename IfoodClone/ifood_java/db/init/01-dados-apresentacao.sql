-- MySQL dump 10.13  Distrib 8.0.46, for Linux (x86_64)
--
-- Host: localhost    Database: ifood_java
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `ifood_java`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `ifood_java` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `ifood_java`;

--
-- Table structure for table `categoria_produtos`
--

DROP TABLE IF EXISTS `categoria_produtos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categoria_produtos` (
  `id_categoria` bigint NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_categoria`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categoria_produtos`
--

LOCK TABLES `categoria_produtos` WRITE;
/*!40000 ALTER TABLE `categoria_produtos` DISABLE KEYS */;
INSERT INTO `categoria_produtos` VALUES (1,'Pizzas'),(2,'Bebidas'),(3,'Massas'),(4,'Espetinhos'),(5,'Pratos'),(6,'Porções'),(7,'Entradas'),(8,'Pastéis'),(9,'Caldos'),(10,'Lanches'),(11,'Acompanhamentos'),(12,'Doces'),(13,'Bolos');
/*!40000 ALTER TABLE `categoria_produtos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categoria_restaurante`
--

DROP TABLE IF EXISTS `categoria_restaurante`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categoria_restaurante` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) DEFAULT NULL,
  `url_imagem` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categoria_restaurante`
--

LOCK TABLES `categoria_restaurante` WRITE;
/*!40000 ALTER TABLE `categoria_restaurante` DISABLE KEYS */;
INSERT INTO `categoria_restaurante` VALUES (1,'Pizzaria','/uploads/b570bb61-72f4-4651-a163-032530100c6d_pizza.categoria.jpg'),(2,'Italiana','/uploads/f1ad59df-233d-4bb3-90dd-b0919a8330c1_comida_italiana.jpg'),(3,'Churrascaria','/uploads/5d645293-69bd-4685-847c-e4047f0f589e_churrascaria.jpg'),(4,'Chinesa','/uploads/cc437270-1172-4591-b61f-1f0f4ba71962_Comidachinesa.png'),(5,'Pastelaria','/uploads/4f6bfd44-568e-46f4-a96b-69be43b3fc5e_pastelaria.jpg'),(6,'Hamburgueria','/uploads/303d86cb-9546-4eff-8bbc-13dffa8d9b4d_categoria-hamburguer.avif'),(7,'Doces','/uploads/858cc7fa-3431-4560-89f0-9eac90950a3a_doce.png');
/*!40000 ALTER TABLE `categoria_restaurante` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `enderecos`
--

DROP TABLE IF EXISTS `enderecos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `enderecos` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `bairro` varchar(255) DEFAULT NULL,
  `cep` varchar(255) DEFAULT NULL,
  `cidade` varchar(255) DEFAULT NULL,
  `estado` varchar(255) DEFAULT NULL,
  `numero` varchar(255) DEFAULT NULL,
  `rua` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enderecos`
--

LOCK TABLES `enderecos` WRITE;
/*!40000 ALTER TABLE `enderecos` DISABLE KEYS */;
INSERT INTO `enderecos` VALUES (1,'Boa Viagem','51020000','Recife','PE','100','Rua do Dono'),(2,'Boa Viagem','51020000','Recife','PE','101','Rua do Dono'),(3,'Boa Viagem','51020000','Recife','PE','102','Rua do Dono'),(4,'Boa Viagem','51020000','Recife','PE','103','Rua do Dono'),(5,'Boa Viagem','51020000','Recife','PE','104','Rua do Dono'),(6,'Boa Viagem','51020000','Recife','PE','105','Rua do Dono'),(7,'Boa Viagem','51020000','Recife','PE','106','Rua do Dono'),(8,'Boa Viagem','51020000','Recife','PE','1000','Av. Conselheiro Aguiar'),(9,'Boa Viagem','51020000','Recife','PE','1050','Av. Conselheiro Aguiar'),(10,'Boa Viagem','51020000','Recife','PE','1100','Av. Conselheiro Aguiar'),(11,'Boa Viagem','51020000','Recife','PE','1150','Av. Conselheiro Aguiar'),(12,'Boa Viagem','51020000','Recife','PE','1200','Av. Conselheiro Aguiar'),(13,'Boa Viagem','51020000','Recife','PE','1250','Av. Conselheiro Aguiar'),(14,'Boa Viagem','51020000','Recife','PE','1300','Av. Conselheiro Aguiar'),(15,'Boa Vista','50050000','Recife','PE','325','Rua da Aurora');
/*!40000 ALTER TABLE `enderecos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_token`
--

DROP TABLE IF EXISTS `password_reset_token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_token` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `expiracao` datetime(6) DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL,
  `usuario_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK3ydhvlv76ltk8wt0t28u0tr9w` (`usuario_id`),
  CONSTRAINT `FKo8eq9ly8dv6gy4bpqppfhh72t` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_token`
--

LOCK TABLES `password_reset_token` WRITE;
/*!40000 ALTER TABLE `password_reset_token` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedido`
--

DROP TABLE IF EXISTS `pedido`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedido` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `data_criacao` datetime(6) DEFAULT NULL,
  `metodo_pagamento` varchar(255) DEFAULT NULL,
  `pagamento_status` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `valor_total` decimal(38,2) DEFAULT NULL,
  `id_cliente` bigint DEFAULT NULL,
  `id_restaurante` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKcf1w1gn4jvkpmbo722phkbo2t` (`id_cliente`),
  KEY `FK38kdlm6wkqjfk9l72iv55wg26` (`id_restaurante`),
  CONSTRAINT `FK38kdlm6wkqjfk9l72iv55wg26` FOREIGN KEY (`id_restaurante`) REFERENCES `restaurante` (`id_restaurante`),
  CONSTRAINT `FKcf1w1gn4jvkpmbo722phkbo2t` FOREIGN KEY (`id_cliente`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedido`
--

LOCK TABLES `pedido` WRITE;
/*!40000 ALTER TABLE `pedido` DISABLE KEYS */;
/*!40000 ALTER TABLE `pedido` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedido_item`
--

DROP TABLE IF EXISTS `pedido_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedido_item` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `quantidade` int DEFAULT NULL,
  `subtotal` decimal(38,2) DEFAULT NULL,
  `id_pedido` bigint DEFAULT NULL,
  `id_produto` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKkhwdtsmompsbn7dn0ghxhgurm` (`id_pedido`),
  KEY `FK1haohvef72ervilajy9bfrxg` (`id_produto`),
  CONSTRAINT `FK1haohvef72ervilajy9bfrxg` FOREIGN KEY (`id_produto`) REFERENCES `produtos` (`id_produto`),
  CONSTRAINT `FKkhwdtsmompsbn7dn0ghxhgurm` FOREIGN KEY (`id_pedido`) REFERENCES `pedido` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedido_item`
--

LOCK TABLES `pedido_item` WRITE;
/*!40000 ALTER TABLE `pedido_item` DISABLE KEYS */;
/*!40000 ALTER TABLE `pedido_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `produtos`
--

DROP TABLE IF EXISTS `produtos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `produtos` (
  `id_produto` bigint NOT NULL AUTO_INCREMENT,
  `ativo` bit(1) DEFAULT NULL,
  `descricao` varchar(255) DEFAULT NULL,
  `nome` varchar(255) DEFAULT NULL,
  `preco` decimal(38,2) DEFAULT NULL,
  `url_imagem` varchar(255) DEFAULT NULL,
  `id_categoria` bigint DEFAULT NULL,
  `id_restaurante` bigint NOT NULL,
  PRIMARY KEY (`id_produto`),
  KEY `FKd70bu99n9k4afb04klp30xey0` (`id_categoria`),
  KEY `FKrjjoexycg8yhpkfhyopdiu89q` (`id_restaurante`),
  CONSTRAINT `FKd70bu99n9k4afb04klp30xey0` FOREIGN KEY (`id_categoria`) REFERENCES `categoria_produtos` (`id_categoria`),
  CONSTRAINT `FKrjjoexycg8yhpkfhyopdiu89q` FOREIGN KEY (`id_restaurante`) REFERENCES `restaurante` (`id_restaurante`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `produtos`
--

LOCK TABLES `produtos` WRITE;
/*!40000 ALTER TABLE `produtos` DISABLE KEYS */;
INSERT INTO `produtos` VALUES (1,_binary '','Molho de tomate, mussarela e orégano','Pizza Mussarela',49.90,'/uploads/302064e1-296c-4bec-a340-3f4c729a8383_mussarela.jpg',1,1),(2,_binary '','Calabresa fatiada, cebola e azeitonas','Pizza Calabresa',52.90,'/uploads/2cf9d654-c22f-4947-a40d-2a64672e6f9c_calabresa.jpg',1,1),(3,_binary '','Mussarela, tomate e manjericão fresco','Pizza Margherita',54.90,'/uploads/f3ea64c4-3cce-4e84-9fc5-b4f247c2e816_marguerita.jpg',1,1),(4,_binary '','Presunto, ovos, cebola, ervilha e mussarela','Pizza Portuguesa',56.90,'/uploads/a686b420-e83a-47bf-804b-db8455f1db3b_portuguesa.jpg',1,1),(5,_binary '','Frango desfiado com Catupiry original','Pizza Frango com Catupiry',57.90,'/uploads/de59e93c-02e1-4619-a93b-6c77b27db90f_frangocomcatupiry.jpg',1,1),(6,_binary '','Refrigerante Coca-Cola garrafa 2 litros','Coca-Cola 2L',14.00,'/uploads/d6d66800-3386-49cc-9113-c89459992fcb_coca.jfif',2,1),(7,_binary '','Espaguete com molho de tomate artesanal e parmesão','Macarronada da Casa',38.90,'/uploads/8ad4613d-b2de-4cd5-839e-1104e4f1261a_macarronada.jfif',3,2),(8,_binary '','Espaguete com molho de carne moída lentamente cozido','Espaguete à Bolonhesa',42.90,'/uploads/57ed59fb-582c-4081-8ef6-78cd9cfa6d21_macarronada2.jfif',3,2),(9,_binary '','Penne com molho sugo e manjericão','Penne ao Sugo',36.90,'/uploads/c2883e27-177d-4f80-95e9-5bf2bdb96b65_macarronada3.jfif',3,2),(10,_binary '','Fettuccine ao molho branco cremoso','Fettuccine Alfredo',44.90,'/uploads/a764119e-1f7e-4f81-bfed-adea50c4dad5_macarronada4.jfif',3,2),(11,_binary '','Massa fresca com molho do dia','Pasta Especial do Chef',49.90,'/uploads/be4fe23b-a771-4438-8c36-820983b5cf58_pasta.webp',3,2),(12,_binary '','Refrigerante Pepsi 350ml','Pepsi Lata',6.50,'/uploads/44f4cd6e-9318-4c7f-b616-245663d5ae82_pepsi.jfif',2,2),(13,_binary '','Espetinho grelhado na brasa','Espetinho de Carne ou Frango',12.90,'/uploads/6cfad324-cdfe-4132-a618-43211c82ecca_espetinho_carne_ou_frango.jpg',4,3),(14,_binary '','Linguiça de frango assada na brasa','Linguiça de Frango',18.90,'/uploads/08bacb68-655d-48a6-9920-52c42ae8b477_linguica_de_frango.jpg',4,3),(15,_binary '','Lombo suíno temperado e assado lentamente','Lombo de Porco',39.90,'/uploads/02cd0da2-42c1-4079-a1f3-5b3385c1507c_lombo_de_porco.jpg',5,3),(16,_binary '','Carne fatiada acompanhada de farofa e vinagrete','Porção de Carne com Farofa',59.90,'/uploads/6afb103a-dbbd-4451-9e9c-5b3cf5407570_porcao_de_carne_fatiada_com_farofa_e_vinagrete.jpg',6,3),(17,_binary '','Porção de batata frita crocante','Batata Frita',22.90,'/uploads/23dca0d9-2283-4764-a8fa-16c8aab2f1f3_batata.jfif',6,3),(18,_binary '','Refrigerante 350ml (consulte sabores)','Refrigerante Lata',6.00,'/uploads/522e1055-f048-43ab-a66b-7951af06c4b1_refrigerante.jpg',2,3),(19,_binary '','Frango empanado ao molho agridoce com arroz','Frango Agridoce com Arroz',34.90,'/uploads/32a326a2-f585-432f-8ff1-df9c1edd0345_frango_agridoce_com_arroz.jpg',5,4),(20,_binary '','Lombo suíno ao molho agridoce com pimentões','Porco Agridoce',36.90,'/uploads/061c0831-3482-460f-ac8c-8b24ebb2b63b_porco_agridoce.jpg',5,4),(21,_binary '','Frango ao molho de laranja com cebolinha','Frango à Laranja',35.90,'/uploads/d45c6d21-3410-41f7-b139-2dcc0759624e_Asian_Oranage_frango_com_cebola_verde.jpg',5,4),(22,_binary '','Rolinhos crocantes de legumes','Rolinho Primavera (4 un.)',19.90,'/uploads/b6b34ec5-0edf-4c92-a88d-51db0ad5f604_rolinho_primavera.jpg',7,4),(23,_binary '','Sopa de legumes ao estilo chinês','Sopa Oriental',24.90,'/uploads/fbc6c756-cbbc-4161-a568-733a78c96bc0_sopa.avif',7,4),(24,_binary '','Pastel crocante recheado com carne moída temperada','Pastel de Carne',12.00,'/uploads/33f0a6c2-bdaa-4fe4-94d8-eef32462db2d_pastel.jfif',8,5),(25,_binary '','Pastel crocante recheado com mussarela','Pastel de Queijo',11.00,'/uploads/16fa8bb1-a655-4cd7-82cc-957ce983303c_pastel.jfif',8,5),(26,_binary '','Caldo de batata com couve e calabresa','Caldo Verde',18.90,'/uploads/3d939713-badc-4c0c-ad75-e725616d6a2e_caldo_verde.jfif',9,5),(27,_binary '','Caldo de feijão com bacon e cheiro-verde','Sopa de Feijão',17.90,'/uploads/8293f964-b4ce-4317-a205-a9204d4d7e14_sopa_de_feijao.jfif',9,5),(28,_binary '','Refrigerante Coca-Cola 350ml','Coca-Cola Lata',6.00,'/uploads/1ed7a4e3-5757-4cd1-811c-8f43ad7eda3f_coca.jfif',2,5),(29,_binary '','Pão, hambúrguer 150g, queijo e maionese da casa','X-Burguer',26.90,'/uploads/231076c2-b2ce-4eb3-9888-2aa809ec2f0e_xburguer.jfif',10,6),(30,_binary '','Blend 180g, cheddar, bacon e cebola caramelizada','Burger Artesanal',34.90,'/uploads/b12b5cec-4bb7-47be-8188-11faf5702b10_hamburguer.avif',10,6),(31,_binary '','Porção de batata frita com cheddar','Batata Frita',19.90,'/uploads/aaf355dd-1f25-4bab-957c-25f2b5a3916d_batata.jfif',11,6),(32,_binary '','Refrigerante Pepsi 350ml','Pepsi Lata',6.00,'/uploads/16f8b653-14c1-464d-8303-7b30e98898d3_pepsi.jfif',2,6),(33,_binary '','Brigadeiros gourmet de chocolate belga','Brigadeiros (6 un.)',18.00,'/uploads/974266ad-5608-4f5d-9ad1-b6b2d6df03f1_brigadeiros.jfif',12,7),(34,_binary '','Cookie com gotas de chocolate','Cookie Gigante',9.90,'/uploads/de4d2eb6-99c8-4889-b219-c18240a1bf82_cookie.jfif',12,7),(35,_binary '','Cupcake de baunilha com cobertura de chantilly','Cupcake',11.90,'/uploads/a7eb8f22-8f5d-4ff0-b673-06af62d85830_cupcake.jfif',12,7),(36,_binary '','Alfajor recheado com doce de leite','Alfajor',8.50,'/uploads/b4cbfee6-af38-41ed-9f98-ad03d8b46533_alfajor.jfif',12,7),(37,_binary '','Fatia de bolo de chocolate com recheio cremoso','Fatia de Bolo',14.90,'/uploads/a7a92e1c-b4ac-47b9-8975-6c686a38b0f3_fatiadebolo.jfif',13,7);
/*!40000 ALTER TABLE `produtos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `restaurante`
--

DROP TABLE IF EXISTS `restaurante`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `restaurante` (
  `id_restaurante` bigint NOT NULL AUTO_INCREMENT,
  `cnpj` varchar(255) DEFAULT NULL,
  `nome` varchar(255) DEFAULT NULL,
  `raio_entrega` varchar(255) DEFAULT NULL,
  `telefone` varchar(255) DEFAULT NULL,
  `url_imagem` varchar(255) DEFAULT NULL,
  `categoria_id` bigint DEFAULT NULL,
  `endereco_id` bigint DEFAULT NULL,
  `id_usuario` bigint NOT NULL,
  PRIMARY KEY (`id_restaurante`),
  UNIQUE KEY `UKbw2hqu80f531u5spgfq90le03` (`id_usuario`),
  UNIQUE KEY `UKki5no6idqiaah4ps02myos733` (`endereco_id`),
  KEY `FKduwgt4kbv750h54ckd86d8url` (`categoria_id`),
  CONSTRAINT `FK5x2ay3eh62grbqb09maohdjfi` FOREIGN KEY (`endereco_id`) REFERENCES `enderecos` (`id`),
  CONSTRAINT `FKduwgt4kbv750h54ckd86d8url` FOREIGN KEY (`categoria_id`) REFERENCES `categoria_restaurante` (`id`),
  CONSTRAINT `FKpkw702nwfkhwsvfqhu90mx9r7` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `restaurante`
--

LOCK TABLES `restaurante` WRITE;
/*!40000 ALTER TABLE `restaurante` DISABLE KEYS */;
INSERT INTO `restaurante` VALUES (1,'11222333000181','Fornaleza Pizzaria Artesanal','5','8133330000','/uploads/42295ebc-afed-4e94-b911-34de4c0f443f_fornaleza.jpeg',1,8,1),(2,'22333444000150','Mamma Mia Cucina','6','8133330001','/uploads/8993b95a-7924-4c68-ab9c-7b0dfd181690_mammamia.jpeg',2,9,2),(3,'33444555000119','Fogo de Chano Churrascaria','8','8133330002','/uploads/11d7c5b5-75df-4c4b-a1ec-ebf13777294c_fogodechano.jpeg',3,10,3),(4,'44555666000177','Dragão Dourado','7','8133330003','/uploads/f35fbee3-73df-4020-a0c0-e4117061af34_dragaodourdo.jpeg',4,11,4),(5,'55666777000135','Pastelli Pastelaria','4','8133330004','/uploads/f3b4ab9e-83e3-4624-b5be-855fc35556b2_pastelli.jfif',5,12,5),(6,'66777888000193','Buck\'s Burger','6','8133330005','/uploads/4f6d7a76-7439-459f-97ec-ec42fbbbddeb_Buck_s.jfif',6,13,6),(7,'77888999000151','Doce Encanto','5','8133330006','/uploads/05368381-63ab-4e7d-9097-24181f724697_doce.png',7,14,7);
/*!40000 ALTER TABLE `restaurante` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id_usuario` bigint NOT NULL AUTO_INCREMENT,
  `cpf` varchar(11) NOT NULL,
  `dt_nascimento` date DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `fone_celular` varchar(15) DEFAULT NULL,
  `nome` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expira` datetime(6) DEFAULT NULL,
  `endereco_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `UK2et2smpfrtsohr7w9fe1v8a5e` (`cpf`),
  UNIQUE KEY `UKkfsp0s1tflm1cwlj8idhqsad0` (`email`),
  UNIQUE KEY `UKc7kjs7w63s5xc3icc3yc8f8y1` (`endereco_id`),
  CONSTRAINT `FK6xhgjg1rqryw943qnwe5nujpc` FOREIGN KEY (`endereco_id`) REFERENCES `enderecos` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'52998224725','1990-05-10','fornaleza@ifood.com','81999990000','Marco Rossi','$2a$10$26K7ECLDJYuCRvXWB5i41O/ofo3S7sHPMgOUOHlAGrjsknXkFpzhW',NULL,NULL,1),(2,'11144477735','1990-05-10','mammamia@ifood.com','81999990001','Giulia Bianchi','$2a$10$TwxMtForu0wS7TYvQUYeo.G4ssWNPdVJ3KFQ33NDNrlFCjatbdX8K',NULL,NULL,2),(3,'39053344705','1990-05-10','fogodechao@ifood.com','81999990002','Carlos Gaúcho','$2a$10$scH6ow8FQe/PwsZzd7EBiO9pT4xoujuJD2PyR6BqieUZBvzBdFCl2',NULL,NULL,3),(4,'86288366757','1990-05-10','dragaodourado@ifood.com','81999990003','Li Wei','$2a$10$vNwAetniuK/AHz7/3zFfrOkihL8cd3g/Xf5jEdNAbL5EgqXK19ezm',NULL,NULL,4),(5,'71428793860','1990-05-10','pastelli@ifood.com','81999990004','Ana Souza','$2a$10$F5Y2CU6BDLTuODGxUAnHFebEAA8Lnjtj.OszJXau0fKDY68rGy/iy',NULL,NULL,5),(6,'15350946056','1990-05-10','bucks@ifood.com','81999990005','Bruno Lima','$2a$10$8QzuYmbTCaxItl36OJDcVe288.5NSVpEXE.AxorGRjacOsHD.44m6',NULL,NULL,6),(7,'93541134780','1990-05-10','doceencanto@ifood.com','81999990006','Carol Mendes','$2a$10$/hrvYmpIUBw7H4/UZtoL.OdS/1bd7ox7L.PRShFBoYGOLFpOqH2.a',NULL,NULL,7),(8,'24843803483','2000-03-15','cliente@ifood.com','81988887777','Cliente Demo','$2a$10$j/wtVApF/yDU2L8TWKNjK.d0IvWpUCiGC85meXP1NK7xdl7koqn7e',NULL,NULL,15);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed
