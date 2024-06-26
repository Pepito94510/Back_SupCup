-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : db:3306
-- Généré le : jeu. 19 oct. 2023 à 13:44
-- Version du serveur : 5.7.42
-- Version de PHP : 8.2.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `supcup_db`
--

-- --------------------------------------------------------

--
-- Structure de la table `BAR`
--

CREATE TABLE `BAR` (
  `id` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `postcode` int(11) NOT NULL,
  `city` varchar(255) NOT NULL,
  `mail` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `BAR_EVENT`
--

CREATE TABLE `BAR_EVENT` (
  `id` int(11) NOT NULL,
  `id_bar` int(11) NOT NULL,
  `id_event` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `EQUIPE`
--

CREATE TABLE `EQUIPE` (
  `id` int(11) NOT NULL,
  `id_sport` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `logo` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `EQUIPE`
--

INSERT INTO `EQUIPE` (`id`, `id_sport`, `name`, `logo`) VALUES
(1, 1, 'Lognes', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `EQUIPE_EVENT`
--

CREATE TABLE `EQUIPE_EVENT` (
  `id` int(11) NOT NULL,
  `id_equipe` int(11) NOT NULL,
  `id_event` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `EVENT`
--

CREATE TABLE `EVENT` (
  `id` int(11) NOT NULL,
  `id_sport` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `FAV_EQUIPE`
--

CREATE TABLE `FAV_EQUIPE` (
  `id` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `id_equipe` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `FAV_SPORT`
--

CREATE TABLE `FAV_SPORT` (
  `id` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `id_sport` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `ROLE`
--

CREATE TABLE `ROLE` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `ROLE`
--

INSERT INTO `ROLE` (`id`, `name`) VALUES
(1, 'ROLE_USER');

-- --------------------------------------------------------

--
-- Structure de la table `SPORT`
--

CREATE TABLE `SPORT` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `SPORT`
--

INSERT INTO `SPORT` (`id`, `name`) VALUES
(1, 'badminton');

-- --------------------------------------------------------

--
-- Structure de la table `USER`
--

CREATE TABLE `USER` (
  `id` int(11) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `telephone` varchar(255) NOT NULL,
  `role_id` int(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `USER`
--

INSERT INTO `USER` (`id`, `last_name`, `first_name`, `email`, `telephone`, `role_id`) VALUES
(1, 'DUJARDIN', 'Jean', 'jean@dujardin.com', '09876567890', 1),
(2, 'DAMIDO', 'Valerie', 'valerie@damido.com', '09876567899', 1),
(3, 'NINET', 'Pierre', 'pierre@ninet.org', '456789876578', 1),
(4, 'JAKSON', 'Michel', 'michel@jakson.com', '45678987652', 1);

-- --------------------------------------------------------

--
-- Structure de la table `USER_EVENT`
--

CREATE TABLE `USER_EVENT` (
  `id` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `id_event` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `BAR`
--
ALTER TABLE `BAR`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_user` (`id_user`);

--
-- Index pour la table `BAR_EVENT`
--
ALTER TABLE `BAR_EVENT`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id_bar` (`id_bar`,`id_event`),
  ADD KEY `id_event` (`id_event`);

--
-- Index pour la table `EQUIPE`
--
ALTER TABLE `EQUIPE`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `EQUIPE_EVENT`
--
ALTER TABLE `EQUIPE_EVENT`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Id_equipe` (`id_equipe`,`id_event`),
  ADD KEY `Id_event` (`id_event`);

--
-- Index pour la table `EVENT`
--
ALTER TABLE `EVENT`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_sport` (`id_sport`);

--
-- Index pour la table `FAV_EQUIPE`
--
ALTER TABLE `FAV_EQUIPE`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id_user` (`id_user`,`id_equipe`),
  ADD KEY `id_equipe` (`id_equipe`);

--
-- Index pour la table `FAV_SPORT`
--
ALTER TABLE `FAV_SPORT`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id_user` (`id_user`,`id_sport`),
  ADD KEY `id_sport` (`id_sport`);

--
-- Index pour la table `ROLE`
--
ALTER TABLE `ROLE`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `SPORT`
--
ALTER TABLE `SPORT`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `USER`
--
ALTER TABLE `USER`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Role_id` (`role_id`);

--
-- Index pour la table `USER_EVENT`
--
ALTER TABLE `USER_EVENT`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id_user` (`id_user`,`id_event`),
  ADD KEY `is_event` (`id_event`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `BAR`
--
ALTER TABLE `BAR`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `BAR_EVENT`
--
ALTER TABLE `BAR_EVENT`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `EQUIPE`
--
ALTER TABLE `EQUIPE`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `EQUIPE_EVENT`
--
ALTER TABLE `EQUIPE_EVENT`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `EVENT`
--
ALTER TABLE `EVENT`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `FAV_EQUIPE`
--
ALTER TABLE `FAV_EQUIPE`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `FAV_SPORT`
--
ALTER TABLE `FAV_SPORT`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `ROLE`
--
ALTER TABLE `ROLE`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `SPORT`
--
ALTER TABLE `SPORT`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `USER`
--
ALTER TABLE `USER`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `USER_EVENT`
--
ALTER TABLE `USER_EVENT`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `BAR`
--
ALTER TABLE `BAR`
  ADD CONSTRAINT `BAR_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `USER` (`id`);

--
-- Contraintes pour la table `BAR_EVENT`
--
ALTER TABLE `BAR_EVENT`
  ADD CONSTRAINT `BAR_EVENT_ibfk_1` FOREIGN KEY (`id_bar`) REFERENCES `BAR` (`id`),
  ADD CONSTRAINT `BAR_EVENT_ibfk_2` FOREIGN KEY (`id_event`) REFERENCES `EVENT` (`id`);

--
-- Contraintes pour la table `EQUIPE_EVENT`
--
ALTER TABLE `EQUIPE_EVENT`
  ADD CONSTRAINT `EQUIPE_EVENT_ibfk_1` FOREIGN KEY (`id_equipe`) REFERENCES `EQUIPE` (`id`),
  ADD CONSTRAINT `EQUIPE_EVENT_ibfk_2` FOREIGN KEY (`id_event`) REFERENCES `EVENT` (`id`);

--
-- Contraintes pour la table `EVENT`
--
ALTER TABLE `EVENT`
  ADD CONSTRAINT `EVENT_ibfk_1` FOREIGN KEY (`id_sport`) REFERENCES `SPORT` (`id`);

--
-- Contraintes pour la table `FAV_EQUIPE`
--
ALTER TABLE `FAV_EQUIPE`
  ADD CONSTRAINT `FAV_EQUIPE_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `USER` (`id`),
  ADD CONSTRAINT `FAV_EQUIPE_ibfk_2` FOREIGN KEY (`id_equipe`) REFERENCES `EQUIPE` (`id`);

--
-- Contraintes pour la table `FAV_SPORT`
--
ALTER TABLE `FAV_SPORT`
  ADD CONSTRAINT `FAV_SPORT_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `USER` (`id`),
  ADD CONSTRAINT `FAV_SPORT_ibfk_2` FOREIGN KEY (`id_sport`) REFERENCES `SPORT` (`id`);

--
-- Contraintes pour la table `USER`
--
ALTER TABLE `USER`
  ADD CONSTRAINT `USER_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `ROLE` (`id`);

--
-- Contraintes pour la table `USER_EVENT`
--
ALTER TABLE `USER_EVENT`
  ADD CONSTRAINT `USER_EVENT_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `USER` (`id`),
  ADD CONSTRAINT `USER_EVENT_ibfk_2` FOREIGN KEY (`id_event`) REFERENCES `EVENT` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
