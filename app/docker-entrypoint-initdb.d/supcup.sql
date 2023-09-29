-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : db:3306
-- Généré le : ven. 29 sep. 2023 à 09:47
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
  `id_event` int(11) NOT NULL,
  `description` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `EQUIPE`
--

CREATE TABLE `EQUIPE` (
  `id` int(11) NOT NULL,
  `id_sport` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `logo` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `EVENT`
--

CREATE TABLE `EVENT` (
  `id` int(11) NOT NULL,
  `id_sport` int(11) NOT NULL,
  `id_equipes` int(11) NOT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `FAV_EQUIPE`
--

CREATE TABLE `FAV_EQUIPE` (
  `id` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `id_equipe` int(11) NOT NULL,
  `description` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `FAV_SPORT`
--

CREATE TABLE `FAV_SPORT` (
  `id` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `id_sport` int(11) NOT NULL,
  `description` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `ROLE`
--

CREATE TABLE `ROLE` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `SPORT`
--

CREATE TABLE `SPORT` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `USER`
--

CREATE TABLE `USER` (
  `Id` int(11) NOT NULL,
  `Nom` varchar(255) NOT NULL,
  `Prenom` varchar(255) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `Telephone` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `USER`
--

INSERT INTO `USER` (`Id`, `Nom`, `Prenom`, `Email`, `Telephone`) VALUES
(1, 'DUJARDIN', 'Jean', 'jean@dujardin.com', '09876567890'),
(2, 'DAMIDO', 'Valerie', 'valerie@damido.com', '09876567899'),
(3, 'NINET', 'Pierre', 'pierre@ninet.org', '456789876578'),
(4, 'JAKSON', 'Michel', 'michel@jakson.com', '45678987652');

-- --------------------------------------------------------

--
-- Structure de la table `USER_EVENT`
--

CREATE TABLE `USER_EVENT` (
  `id` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `is_event` int(11) NOT NULL,
  `description` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `BAR`
--
ALTER TABLE `BAR`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `BAR_EVENT`
--
ALTER TABLE `BAR_EVENT`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `EQUIPE`
--
ALTER TABLE `EQUIPE`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `EVENT`
--
ALTER TABLE `EVENT`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `FAV_EQUIPE`
--
ALTER TABLE `FAV_EQUIPE`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `FAV_SPORT`
--
ALTER TABLE `FAV_SPORT`
  ADD PRIMARY KEY (`id`);

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
  ADD PRIMARY KEY (`Id`);

--
-- Index pour la table `USER_EVENT`
--
ALTER TABLE `USER_EVENT`
  ADD PRIMARY KEY (`id`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `SPORT`
--
ALTER TABLE `SPORT`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `USER`
--
ALTER TABLE `USER`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `USER_EVENT`
--
ALTER TABLE `USER_EVENT`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
