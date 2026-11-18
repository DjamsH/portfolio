/**
 * Tout le contenu du site vit ici : textes, chiffres, missions, logos.
 * Modifier ce fichier suffit, aucun composant n'est à toucher.
 *
 * - Chiffres : chacun est provisoire et marqué `// TODO: chiffre provisoire`.
 * - Logos : chaque logo (client ou outil) a un booléen `enabled`.
 *   Passer à `false` le retire partout où il apparaît.
 */

export type Figure = {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
};

export type Client = {
  id: string;
  name: string;
  /** Fichier dans public/logos/clients/ */
  file: string;
  enabled: boolean;
};

export type Tool = {
  id: string;
  name: string;
  /** Slug simple-icons. Absent : wordmark texte. */
  icon?: string;
  enabled: boolean;
};

export type CaseVisual = 'pipeline' | 'lineage' | 'mesh' | 'migration';

export type CaseStudy = {
  id: string;
  number: string;
  clientId: string;
  role: string;
  period: string;
  place: string;
  /** Les fragments entre astérisques passent en italique. */
  title: string;
  context: string;
  points: string[];
  tools: string[];
  figures: Figure[];
  visual: CaseVisual;
  visualAlt: string;
};

// ---------------------------------------------------------------------------
// Identité et référencement
// ---------------------------------------------------------------------------

export const identity = {
  name: 'Djamel Harrous',
  role: 'Senior Data & AI Engineer',
  email: 'dharrous@gmail.com',
  // TODO: remplacer par l'URL du profil LinkedIn.
  linkedin: 'https://www.linkedin.com/',
  company: 'NOXSY SASU',
  locations: ['Paris', 'Lille', 'Remote'],
};

export const seo = {
  title: 'Djamel Harrous, Senior Data & AI Engineer freelance',
  description:
    'Migration de SI décisionnels vers Snowflake et Google Cloud, plateformes data sur dbt et Airflow, IA générative sur vos données. Freelance à Paris, Lille et à distance.',
  ogImage: '/og.png',
  ogImageAlt:
    'Djamel Harrous, Senior Data & AI Engineer. Du Teradata à l’IA générative, sans rien casser en route.',
};

// ---------------------------------------------------------------------------
// 1. Masthead
// ---------------------------------------------------------------------------

export const nav = [
  { label: 'Études de cas', href: '#etudes-de-cas' },
  { label: 'Parcours', href: '#parcours' },
  { label: 'Stack', href: '#stack' },
  { label: 'Offre', href: '#offre' },
  { label: 'Contact', href: '#contact' },
];

export const strap = ['Data & AI Engineering', 'Paris', 'Lille', 'Remote', 'Édition 2026'];

// ---------------------------------------------------------------------------
// 2. Une
// ---------------------------------------------------------------------------

export const hero = {
  /** Une entrée par ligne (au-delà de 640 px). `accent: true` : italique vermillon souligné. */
  titleLines: [
    { text: 'Du Teradata' },
    { text: 'à l’IA générative,' },
    { text: 'sans rien casser', accent: true },
    { text: 'en route.' },
  ],
  standfirst:
    'Quinze ans à faire tourner des systèmes décisionnels, dont six à les déménager dans le cloud.',
  body: 'Je conçois, migre et industrialise des plateformes data sur Snowflake et Google Cloud, avec dbt et Airflow, puis j’y branche l’IA générative. Je connais l’existant à reprendre (Oracle, Teradata, Talend, ODI) aussi bien que la cible. C’est ce qui permet de mener une migration de bout en bout, de la conception jusqu’au run.',
  primaryCta: { label: 'Discuter d’une mission', href: `mailto:${identity.email}` },
  secondaryCta: { label: 'Lire les études de cas', href: '#etudes-de-cas' },
  portrait: {
    src: '/portrait.jpg',
    alt: 'Portrait de Djamel Harrous',
    width: 960,
    height: 1200,
  },
};

// ---------------------------------------------------------------------------
// 3. Chiffres clés
// ---------------------------------------------------------------------------

export const keyFigures: Figure[] = [
  { value: 15, suffix: ' ans', label: 'de data, dont six dans le cloud' }, // TODO: chiffre provisoire
  { value: 1200, label: 'flux migrés' }, // TODO: chiffre provisoire
  { value: 25, label: 'développeurs accompagnés' }, // TODO: chiffre provisoire
  { value: 35, prefix: '−', suffix: ' %', label: 'de coût de run' }, // TODO: chiffre provisoire
];

// ---------------------------------------------------------------------------
// 4. Clients
// ---------------------------------------------------------------------------

export const clientsHeading = 'Ils m’ont confié leurs données';

/**
 * Un fichier par client dans public/logos/clients/ : SVG de préférence, PNG ou JPEG acceptés
 * (un fond blanc se fond dans la page). Les fichiers encore en placeholder (nom en capitales)
 * sont à remplacer par les logos officiels, en gardant le même nom de fichier.
 * `enabled: false` tant que l'autorisation du client n'est pas vérifiée.
 */
export const clients: Client[] = [
  { id: 'safran', name: 'Safran', file: 'safran.svg', enabled: true },
  { id: 'oscaro', name: 'Oscaro', file: 'oscaro.svg', enabled: true },
  { id: 'saint-maclou', name: 'Tapis Saint Maclou', file: 'saint-maclou.svg', enabled: true },
  { id: 'auchan', name: 'Auchan', file: 'auchan.svg', enabled: true },
  {
    id: 'euro-information',
    name: 'Euro Information (Crédit Mutuel)',
    file: 'euro-information.svg',
    enabled: true,
  },
  { id: 'vilogia', name: 'Vilogia', file: 'vilogia.svg', enabled: true },
  { id: 'syngenta', name: 'Syngenta', file: 'syngenta.svg', enabled: true },
  { id: 'jules', name: 'Jules', file: 'jules.svg', enabled: true }, // ex-Happychic
  { id: 'cofely-ineo', name: 'Cofely Ineo (GDF Suez)', file: 'cofely-ineo.jpg', enabled: true },
];

// ---------------------------------------------------------------------------
// Outils (référencés par les études de cas, le parcours et la stack)
// ---------------------------------------------------------------------------

/**
 * `icon` est un slug simple-icons. Les outils sans icône dans simple-icons
 * (AWS, Azure, dbt, Dagster, Fivetran, SQL, Oracle, ODI) s'affichent en wordmark texte.
 */
export const tools: Tool[] = [
  { id: 'snowflake', name: 'Snowflake', icon: 'snowflake', enabled: true },
  { id: 'gcp', name: 'Google Cloud', icon: 'googlecloud', enabled: true },
  { id: 'bigquery', name: 'BigQuery', icon: 'googlebigquery', enabled: true },
  { id: 'aws', name: 'AWS', enabled: true },
  { id: 'azure', name: 'Azure', enabled: true },
  { id: 'dbt', name: 'dbt', enabled: true },
  { id: 'airflow', name: 'Airflow', icon: 'apacheairflow', enabled: true },
  { id: 'dagster', name: 'Dagster', enabled: true },
  { id: 'fivetran', name: 'Fivetran', enabled: true },
  { id: 'airbyte', name: 'Airbyte', icon: 'airbyte', enabled: true },
  { id: 'terraform', name: 'Terraform', icon: 'terraform', enabled: true },
  { id: 'docker', name: 'Docker', icon: 'docker', enabled: true },
  { id: 'kubernetes', name: 'Kubernetes', icon: 'kubernetes', enabled: true },
  { id: 'gitlab', name: 'GitLab', icon: 'gitlab', enabled: true },
  { id: 'vault', name: 'Vault', icon: 'vault', enabled: true },
  { id: 'python', name: 'Python', icon: 'python', enabled: true },
  { id: 'sql', name: 'SQL', enabled: true },
  { id: 'streamlit', name: 'Streamlit', icon: 'streamlit', enabled: true },
  { id: 'claude', name: 'Claude', icon: 'claude', enabled: true },
  { id: 'mcp', name: 'MCP', icon: 'modelcontextprotocol', enabled: true },
  { id: 'oracle', name: 'Oracle', enabled: true },
  { id: 'teradata', name: 'Teradata', icon: 'teradata', enabled: true },
  { id: 'talend', name: 'Talend', icon: 'talend', enabled: true },
  { id: 'odi', name: 'ODI', enabled: true },
  { id: 'sap-bo', name: 'SAP BO', icon: 'sap', enabled: true },
];

// ---------------------------------------------------------------------------
// 5. Études de cas
// ---------------------------------------------------------------------------

export const casesIntro = {
  label: 'Études de cas',
  title: 'Quatre missions, de la *plus récente* à la plus longue.',
};

export const cases: CaseStudy[] = [
  {
    id: 'safran',
    number: '01',
    clientId: 'safran',
    role: 'Data & AI Engineer',
    period: 'Depuis janvier 2026',
    place: 'Malakoff',
    title: 'Tous les flux RH sur Snowflake, *avec Cortex* dans la boucle.',
    context:
      'Dans le cadre de la modernisation cloud du SI, l’ensemble des flux Ressources Humaines migre vers une plateforme Snowflake.',
    points: [
      'Transformations et modélisation avec dbt Core.',
      'Ingestion en temps réel et automatisation : Snowpipe, Tasks.',
      'IA générative : Snowflake Cortex (Cortex CLI) et interfaces Streamlit.',
      'Gouvernance : conception des entrepôts, contrôle d’accès RBAC, gestion des secrets.',
      'Orchestration Airflow / Cloud Composer ; Docker, Kubernetes, Terraform, CI/CD GitLab.',
    ],
    tools: ['snowflake', 'dbt', 'airflow', 'streamlit', 'terraform', 'kubernetes', 'gitlab'],
    figures: [
      { value: 100, suffix: ' %', label: 'du périmètre RH repris sur Snowflake' }, // TODO: chiffre provisoire
      {
        value: 6,
        label: 'briques tenues de bout en bout : ingestion, transformation, orchestration, IA, gouvernance, CI/CD',
      }, // TODO: chiffre provisoire
    ],
    visual: 'pipeline',
    visualAlt:
      'Schéma : les sources RH alimentent Snowpipe et Tasks, puis dbt Core, puis Snowflake, qui sert Streamlit et Cortex.',
  },
  {
    id: 'oscaro',
    number: '02',
    clientId: 'oscaro',
    role: 'Data Engineer, lead technique',
    period: 'Février – décembre 2025',
    place: 'Gennevilliers',
    title: 'Une équipe dbt qui livre *au même standard*.',
    context:
      'Conception, développement et optimisation des pipelines de données sur Google Cloud. Encadrement d’une équipe de développeurs dbt et SQL, avec des bonnes pratiques d’ingénierie définies puis diffusées.',
    points: [
      'Transformations et modélisation avec dbt Core.',
      'Orchestration : DAGs Python sous Airflow / Cloud Composer.',
      'Administration des services GCP : BigQuery, Cloud Storage, IAM.',
      'Docker, Kubernetes, Terraform, CI/CD GitLab.',
    ],
    tools: ['bigquery', 'dbt', 'airflow', 'gcp', 'terraform', 'gitlab'],
    figures: [
      { value: 25, label: 'développeurs dbt et SQL accompagnés' }, // TODO: chiffre provisoire
      { value: 11, suffix: ' mois', label: 'de mission' }, // TODO: chiffre provisoire
    ],
    visual: 'lineage',
    visualAlt:
      'Schéma : un lineage dbt, des sources aux marts, où un test en échec est corrigé en revue avant la livraison.',
  },
  {
    id: 'saint-maclou',
    number: '03',
    clientId: 'saint-maclou',
    role: 'Data Engineer, conception de plateforme',
    period: 'Novembre 2023 – février 2025',
    place: 'Wattrelos',
    title: 'Une plateforme data partie de zéro, *organisée en Data Mesh*.',
    context:
      'Conception et création de la plateforme data de l’entreprise sur Snowflake, dbt et Airflow.',
    points: [
      'Architecture Data Mesh : domaines de données, autonomie des équipes métier, gouvernance décentralisée.',
      'Ingestion : flux Fivetran vers Snowflake.',
      'Transformations dbt Core, orchestration Airflow / Cloud Composer.',
      'Snowflake : entrepôts, contrôle d’accès RBAC, gestion des secrets, interfaces Streamlit.',
      'Docker, Kubernetes, Terraform, CI/CD GitLab, Vault.',
    ],
    tools: ['snowflake', 'dbt', 'airflow', 'fivetran', 'streamlit', 'terraform', 'vault'],
    figures: [
      { value: 16, suffix: ' mois', label: 'de la page blanche à la production' }, // TODO: chiffre provisoire
      { value: 4, label: 'briques assemblées : Fivetran, Snowflake, dbt, Airflow' }, // TODO: chiffre provisoire
    ],
    visual: 'mesh',
    visualAlt:
      'Schéma : quatre domaines de données reliés entre eux et à une plateforme Snowflake commune.',
  },
  {
    id: 'auchan',
    number: '04',
    clientId: 'auchan',
    role: 'Data Engineer Cloud',
    period: 'Juin 2020 – octobre 2023',
    place: 'Lille',
    title: 'Le décisionnel quitte Teradata et Talend *pour Google Cloud*.',
    context: 'Migration du SI décisionnel (Talend / Teradata) vers Google Cloud Platform.',
    points: [
      'Orchestration : DAGs Python sous Airflow / Cloud Composer, avec monitoring et gestion des rejets.',
      'Pipelines GCP : BigQuery, Cloud Storage, Dataflow, Data Fusion, Dataproc.',
      'Scripting data : Python, Bash, SQL et Jinja.',
      'Qualité : revues de code, merge requests, intégration continue.',
    ],
    tools: ['teradata', 'talend', 'bigquery', 'airflow', 'gcp', 'python'],
    figures: [
      { value: 1200, label: 'flux migrés' }, // TODO: chiffre provisoire
      { value: 35, prefix: '−', suffix: ' %', label: 'de coût de run' }, // TODO: chiffre provisoire
      { value: 40, suffix: ' mois', label: 'de mission' }, // TODO: chiffre provisoire
    ],
    visual: 'migration',
    visualAlt:
      'Schéma : une grille de flux qui basculent un à un de Teradata et Talend vers BigQuery et Airflow.',
  },
];

/** Libellés du schéma Data Mesh (étude de cas 03). TODO: libellés illustratifs, à confirmer. */
export const meshDomains = ['Ventes', 'Stocks', 'Clients', 'Finance'];

/** Étude de cas 04 : nombre de flux représentés par un carré de la grille. */
export const migrationUnit = 10; // TODO: chiffre provisoire

// ---------------------------------------------------------------------------
// 6. Parcours
// ---------------------------------------------------------------------------

export const parcours = {
  label: 'Parcours',
  before: {
    title: 'Hier',
    period: '2012 – 2020',
    text: 'Oracle, Teradata, ODI, Talend, Business Objects. J’ai construit et maintenu ce que j’aide aujourd’hui à migrer.',
  },
  after: {
    title: 'Aujourd’hui',
    period: '2020 – 2026',
    text: 'Snowflake, BigQuery, dbt, Airflow, Cortex. Les mêmes métiers, sur une plateforme que l’équipe sait faire évoluer.',
  },
  /** Chaque voie relie un outil d'hier à son équivalent d'aujourd'hui. */
  lanes: [
    { role: 'Entrepôt', from: 'oracle', to: 'snowflake' },
    { role: 'Analytique', from: 'teradata', to: 'bigquery' },
    { role: 'Transformation', from: 'talend', to: 'dbt' },
    { role: 'Orchestration', from: 'odi', to: 'airflow' },
    { role: 'Restitution', from: 'sap-bo', to: 'streamlit' },
  ],
  timelineStart: 2012,
  timelineEnd: 2026,
  milestones: [
    { year: 2012, client: 'Cofely Ineo (GDF Suez)', note: 'Business Objects, PL/SQL' },
    { year: 2013, client: 'Jules (ex-Happychic)', note: 'ODI, Oracle' },
    { year: 2014, client: 'Euro Information', note: 'ODI, Netezza' },
    { year: 2016, client: 'Syngenta, Vilogia', note: 'Talend, ODI' },
    { year: 2017, client: 'Auchan Retail France', note: 'Chef de projet BI' },
    { year: 2020, client: 'Auchan Retail International', note: 'Migration vers Google Cloud', pivot: true },
    { year: 2023, client: 'Tapis Saint Maclou', note: 'Plateforme Snowflake' },
    { year: 2025, client: 'Oscaro', note: 'Lead dbt, Google Cloud' },
    { year: 2026, client: 'Safran', note: 'Snowflake, Cortex' },
  ],
};

// ---------------------------------------------------------------------------
// 7. Stack
// ---------------------------------------------------------------------------

export const stackIntro = {
  label: 'Stack',
  title: 'Les outils que je mets *en production*.',
};

export const stack = [
  { family: 'Cloud & plateformes', tools: ['snowflake', 'gcp', 'bigquery', 'aws', 'azure'] },
  { family: 'Transformation & orchestration', tools: ['dbt', 'airflow', 'dagster'] },
  { family: 'Ingestion', tools: ['fivetran', 'airbyte'] },
  { family: 'DevOps & IaC', tools: ['terraform', 'docker', 'kubernetes', 'gitlab', 'vault'] },
  { family: 'Langages & IA', tools: ['python', 'sql', 'streamlit', 'claude', 'mcp'] },
  { family: 'Legacy maîtrisé', tools: ['oracle', 'teradata', 'talend', 'odi', 'sap-bo'] },
];

// ---------------------------------------------------------------------------
// 8. Offre
// ---------------------------------------------------------------------------

export const offersIntro = {
  label: 'Offre',
  title: 'Quatre façons de *travailler ensemble*.',
};

export const offers = [
  {
    title: 'Migration de SI data',
    text: 'Teradata, Oracle, Talend ou ODI vers Snowflake ou BigQuery. Inventaire des flux, plan de bascule, migration par lots, puis arrêt de l’ancien système.',
    scope: 'De la conception jusqu’au run',
  },
  {
    title: 'Plateforme data moderne',
    text: 'Une plateforme partie de zéro ou remise d’aplomb : ingestion Fivetran ou Airbyte, dbt, Airflow ou Dagster, Terraform, CI/CD, contrôle d’accès et gestion des secrets.',
    scope: 'Snowflake ou Google Cloud',
  },
  {
    title: 'IA sur vos données',
    text: 'Snowflake Cortex, interfaces Streamlit, serveurs MCP et développement assisté par Claude Code, branchés sur des données gouvernées.',
    scope: 'Du prototype à la production',
  },
  {
    title: 'Audit et lead technique',
    text: 'Diagnostic de l’existant, standards dbt et SQL, revues de code et montée en compétence de l’équipe.',
    scope: 'En renfort d’une équipe en place',
  },
];

// ---------------------------------------------------------------------------
// 9. Contact
// ---------------------------------------------------------------------------

export const contact = {
  label: 'Contact',
  title: 'Parlons de votre *plateforme*.',
  text: 'Décrivez votre existant, votre cible et votre échéance : cela suffit pour un premier échange.',
  cta: 'Écrire à Djamel',
  linkedinLabel: 'Profil LinkedIn',
  legal: 'Djamel Harrous exerce au sein de NOXSY SASU.',
};
