
CREATE TABLE public.authors (
    id integer NOT NULL,
    english_name character varying(255),
    original_name character varying(255),
    slug character varying(255)
);


--
-- TOC entry 185 (class 1259 OID 16385)
-- Name: authors_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.authors_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2247 (class 0 OID 0)
-- Dependencies: 185
-- Name: authors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.authors_id_seq OWNED BY public.authors.id;


--
-- TOC entry 188 (class 1259 OID 16400)
-- Name: collections; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.collections (
    id integer NOT NULL,
    title character varying(255),
    slug character varying(255),
    urn character varying(255),
    repository character varying(255)
);


--
-- TOC entry 187 (class 1259 OID 16398)
-- Name: collections_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.collections_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2248 (class 0 OID 0)
-- Dependencies: 187
-- Name: collections_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.collections_id_seq OWNED BY public.collections.id;


--
-- TOC entry 196 (class 1259 OID 16472)
-- Name: exemplars; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.exemplars (
    id integer NOT NULL,
    title character varying(255),
    slug character varying(255),
    description character varying(255),
    urn character varying(255),
    "workId" integer
);


--
-- TOC entry 195 (class 1259 OID 16470)
-- Name: exemplars_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.exemplars_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2249 (class 0 OID 0)
-- Dependencies: 195
-- Name: exemplars_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.exemplars_id_seq OWNED BY public.exemplars.id;


--
-- TOC entry 190 (class 1259 OID 16413)
-- Name: languages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.languages (
    id integer NOT NULL,
    title character varying(255),
    slug character varying(255)
);


--
-- TOC entry 189 (class 1259 OID 16411)
-- Name: languages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.languages_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2250 (class 0 OID 0)
-- Dependencies: 189
-- Name: languages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.languages_id_seq OWNED BY public.languages.id;


--
-- TOC entry 198 (class 1259 OID 16490)
-- Name: refsdecls; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.refsdecls (
    id integer NOT NULL,
    label character varying(255),
    slug character varying(255),
    description text,
    match_pattern character varying(255),
    replacement_pattern text,
    structure_index integer,
    urn character varying(255),
    "workId" integer
);


--
-- TOC entry 197 (class 1259 OID 16488)
-- Name: refsdecls_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.refsdecls_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2251 (class 0 OID 0)
-- Dependencies: 197
-- Name: refsdecls_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.refsdecls_id_seq OWNED BY public.refsdecls.id;


--
-- TOC entry 192 (class 1259 OID 16426)
-- Name: textgroups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.textgroups (
    id integer NOT NULL,
    title character varying(255),
    slug character varying(255),
    urn character varying(255),
    "collectionId" integer
);


--
-- TOC entry 191 (class 1259 OID 16424)
-- Name: textgroups_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.textgroups_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2252 (class 0 OID 0)
-- Dependencies: 191
-- Name: textgroups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.textgroups_id_seq OWNED BY public.textgroups.id;


--
-- TOC entry 200 (class 1259 OID 16508)
-- Name: textnodes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.textnodes (
    id integer NOT NULL,
    index integer,
    location integer[],
    text text,
    "workId" integer
);


--
-- TOC entry 199 (class 1259 OID 16506)
-- Name: textnodes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.textnodes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2253 (class 0 OID 0)
-- Dependencies: 199
-- Name: textnodes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.textnodes_id_seq OWNED BY public.textnodes.id;


--
-- TOC entry 202 (class 1259 OID 16524)
-- Name: translations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.translations (
    id integer NOT NULL,
    title character varying(255),
    slug character varying(255),
    description text,
    urn character varying(255),
    "workId" integer
);


--
-- TOC entry 201 (class 1259 OID 16522)
-- Name: translations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.translations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2254 (class 0 OID 0)
-- Dependencies: 201
-- Name: translations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.translations_id_seq OWNED BY public.translations.id;


--
-- TOC entry 204 (class 1259 OID 16542)
-- Name: versions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.versions (
    id integer NOT NULL,
    title character varying(255),
    slug character varying(255),
    description text,
    urn character varying(255),
    "workId" integer
);


--
-- TOC entry 203 (class 1259 OID 16540)
-- Name: versions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.versions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2255 (class 0 OID 0)
-- Dependencies: 203
-- Name: versions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.versions_id_seq OWNED BY public.versions.id;


--
-- TOC entry 194 (class 1259 OID 16444)
-- Name: works; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.works (
    id integer NOT NULL,
    filemd5hash character varying(255),
    filename character varying(255),
    original_title character varying(255),
    english_title character varying(255),
    slug character varying(255),
    structure character varying(255),
    form character varying(255),
    urn character varying(255),
    "authorId" integer,
    "languageId" integer,
    "textgroupId" integer
);


--
-- TOC entry 193 (class 1259 OID 16442)
-- Name: works_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.works_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2256 (class 0 OID 0)
-- Dependencies: 193
-- Name: works_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.works_id_seq OWNED BY public.works.id;


--
-- TOC entry 2065 (class 2604 OID 16390)
-- Name: authors id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors ALTER COLUMN id SET DEFAULT nextval('public.authors_id_seq'::regclass);


--
-- TOC entry 2066 (class 2604 OID 16403)
-- Name: collections id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collections ALTER COLUMN id SET DEFAULT nextval('public.collections_id_seq'::regclass);


--
-- TOC entry 2070 (class 2604 OID 16475)
-- Name: exemplars id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exemplars ALTER COLUMN id SET DEFAULT nextval('public.exemplars_id_seq'::regclass);


--
-- TOC entry 2067 (class 2604 OID 16416)
-- Name: languages id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.languages ALTER COLUMN id SET DEFAULT nextval('public.languages_id_seq'::regclass);


--
-- TOC entry 2071 (class 2604 OID 16493)
-- Name: refsdecls id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refsdecls ALTER COLUMN id SET DEFAULT nextval('public.refsdecls_id_seq'::regclass);


--
-- TOC entry 2068 (class 2604 OID 16429)
-- Name: textgroups id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.textgroups ALTER COLUMN id SET DEFAULT nextval('public.textgroups_id_seq'::regclass);


--
-- TOC entry 2072 (class 2604 OID 16511)
-- Name: textnodes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.textnodes ALTER COLUMN id SET DEFAULT nextval('public.textnodes_id_seq'::regclass);


--
-- TOC entry 2073 (class 2604 OID 16527)
-- Name: translations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.translations ALTER COLUMN id SET DEFAULT nextval('public.translations_id_seq'::regclass);


--
-- TOC entry 2074 (class 2604 OID 16545)
-- Name: versions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.versions ALTER COLUMN id SET DEFAULT nextval('public.versions_id_seq'::regclass);


--
-- TOC entry 2069 (class 2604 OID 16447)
-- Name: works id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.works ALTER COLUMN id SET DEFAULT nextval('public.works_id_seq'::regclass);


--
-- TOC entry 2076 (class 2606 OID 16395)
-- Name: authors authors_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors
    ADD CONSTRAINT authors_pkey PRIMARY KEY (id);


--
-- TOC entry 2078 (class 2606 OID 16397)
-- Name: authors authors_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors
    ADD CONSTRAINT authors_slug_key UNIQUE (slug);


--
-- TOC entry 2080 (class 2606 OID 16408)
-- Name: collections collections_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collections
    ADD CONSTRAINT collections_pkey PRIMARY KEY (id);


--
-- TOC entry 2082 (class 2606 OID 16410)
-- Name: collections collections_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collections
    ADD CONSTRAINT collections_slug_key UNIQUE (slug);


--
-- TOC entry 2096 (class 2606 OID 16480)
-- Name: exemplars exemplars_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exemplars
    ADD CONSTRAINT exemplars_pkey PRIMARY KEY (id);


--
-- TOC entry 2098 (class 2606 OID 16482)
-- Name: exemplars exemplars_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exemplars
    ADD CONSTRAINT exemplars_slug_key UNIQUE (slug);


--
-- TOC entry 2084 (class 2606 OID 16421)
-- Name: languages languages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.languages
    ADD CONSTRAINT languages_pkey PRIMARY KEY (id);


--
-- TOC entry 2086 (class 2606 OID 16423)
-- Name: languages languages_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.languages
    ADD CONSTRAINT languages_slug_key UNIQUE (slug);


--
-- TOC entry 2100 (class 2606 OID 16498)
-- Name: refsdecls refsdecls_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refsdecls
    ADD CONSTRAINT refsdecls_pkey PRIMARY KEY (id);


--
-- TOC entry 2102 (class 2606 OID 16500)
-- Name: refsdecls refsdecls_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refsdecls
    ADD CONSTRAINT refsdecls_slug_key UNIQUE (slug);


--
-- TOC entry 2088 (class 2606 OID 16434)
-- Name: textgroups textgroups_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.textgroups
    ADD CONSTRAINT textgroups_pkey PRIMARY KEY (id);


--
-- TOC entry 2090 (class 2606 OID 16436)
-- Name: textgroups textgroups_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.textgroups
    ADD CONSTRAINT textgroups_slug_key UNIQUE (slug);


--
-- TOC entry 2104 (class 2606 OID 16516)
-- Name: textnodes textnodes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.textnodes
    ADD CONSTRAINT textnodes_pkey PRIMARY KEY (id);


--
-- TOC entry 2106 (class 2606 OID 16532)
-- Name: translations translations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.translations
    ADD CONSTRAINT translations_pkey PRIMARY KEY (id);


--
-- TOC entry 2108 (class 2606 OID 16534)
-- Name: translations translations_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.translations
    ADD CONSTRAINT translations_slug_key UNIQUE (slug);


--
-- TOC entry 2110 (class 2606 OID 16550)
-- Name: versions versions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.versions
    ADD CONSTRAINT versions_pkey PRIMARY KEY (id);


--
-- TOC entry 2112 (class 2606 OID 16552)
-- Name: versions versions_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.versions
    ADD CONSTRAINT versions_slug_key UNIQUE (slug);


--
-- TOC entry 2092 (class 2606 OID 16452)
-- Name: works works_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.works
    ADD CONSTRAINT works_pkey PRIMARY KEY (id);


--
-- TOC entry 2094 (class 2606 OID 16454)
-- Name: works works_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.works
    ADD CONSTRAINT works_slug_key UNIQUE (slug);


--
-- TOC entry 2117 (class 2606 OID 16483)
-- Name: exemplars exemplars_workId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exemplars
    ADD CONSTRAINT "exemplars_workId_fkey" FOREIGN KEY ("workId") REFERENCES public.works(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 2118 (class 2606 OID 16501)
-- Name: refsdecls refsdecls_workId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refsdecls
    ADD CONSTRAINT "refsdecls_workId_fkey" FOREIGN KEY ("workId") REFERENCES public.works(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 2113 (class 2606 OID 16437)
-- Name: textgroups textgroups_collectionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.textgroups
    ADD CONSTRAINT "textgroups_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES public.collections(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 2119 (class 2606 OID 16517)
-- Name: textnodes textnodes_workId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.textnodes
    ADD CONSTRAINT "textnodes_workId_fkey" FOREIGN KEY ("workId") REFERENCES public.works(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 2120 (class 2606 OID 16535)
-- Name: translations translations_workId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.translations
    ADD CONSTRAINT "translations_workId_fkey" FOREIGN KEY ("workId") REFERENCES public.works(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 2121 (class 2606 OID 16553)
-- Name: versions versions_workId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.versions
    ADD CONSTRAINT "versions_workId_fkey" FOREIGN KEY ("workId") REFERENCES public.works(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 2114 (class 2606 OID 16455)
-- Name: works works_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.works
    ADD CONSTRAINT "works_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public.authors(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 2115 (class 2606 OID 16460)
-- Name: works works_languageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.works
    ADD CONSTRAINT "works_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES public.languages(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 2116 (class 2606 OID 16465)
-- Name: works works_textgroupId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.works
    ADD CONSTRAINT "works_textgroupId_fkey" FOREIGN KEY ("textgroupId") REFERENCES public.textgroups(id) ON UPDATE CASCADE ON DELETE SET NULL;


-- Completed on 2018-04-11 12:04:49

--
-- PostgreSQL database dump complete
--

