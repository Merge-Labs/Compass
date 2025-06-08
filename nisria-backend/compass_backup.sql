--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.token_blacklist_outstandingtoken DROP CONSTRAINT IF EXISTS token_blacklist_outs_user_id_83bc629a_fk_accounts_;
ALTER TABLE IF EXISTS ONLY public.token_blacklist_blacklistedtoken DROP CONSTRAINT IF EXISTS token_blacklist_blacklistedtoken_token_id_3cc7fe56_fk;
ALTER TABLE IF EXISTS ONLY public.task_manager_task DROP CONSTRAINT IF EXISTS task_manager_task_grant_id_5dd5c3dd_fk_grants_grant_id;
ALTER TABLE IF EXISTS ONLY public.task_manager_task DROP CONSTRAINT IF EXISTS task_manager_task_assigned_to_id_aaf7f5f9_fk_accounts_user_id;
ALTER TABLE IF EXISTS ONLY public.task_manager_task DROP CONSTRAINT IF EXISTS task_manager_task_assigned_by_id_94ddebb1_fk_accounts_user_id;
ALTER TABLE IF EXISTS ONLY public.notifications_notification DROP CONSTRAINT IF EXISTS notifications_notifi_recipient_id_d055f3f0_fk_accounts_;
ALTER TABLE IF EXISTS ONLY public.notifications_notification DROP CONSTRAINT IF EXISTS notifications_notifi_assigner_id_9af7d917_fk_accounts_;
ALTER TABLE IF EXISTS ONLY public.grants_grantexpenditure DROP CONSTRAINT IF EXISTS grants_grantexpenditure_grant_id_7175f8ac_fk_grants_grant_id;
ALTER TABLE IF EXISTS ONLY public.grants_grant DROP CONSTRAINT IF EXISTS grants_grant_submitted_by_id_fabea75b_fk_accounts_user_id;
ALTER TABLE IF EXISTS ONLY public.grants_grant_submitted_documents DROP CONSTRAINT IF EXISTS grants_grant_submitt_grant_id_6e327786_fk_grants_gr;
ALTER TABLE IF EXISTS ONLY public.grants_grant_submitted_documents DROP CONSTRAINT IF EXISTS grants_grant_submitt_document_id_a248f8a0_fk_documents;
ALTER TABLE IF EXISTS ONLY public.grants_grant_required_documents DROP CONSTRAINT IF EXISTS grants_grant_require_grant_id_125e5d91_fk_grants_gr;
ALTER TABLE IF EXISTS ONLY public.grants_grant_required_documents DROP CONSTRAINT IF EXISTS grants_grant_require_document_id_75244ebb_fk_documents;
ALTER TABLE IF EXISTS ONLY public.grants_grant DROP CONSTRAINT IF EXISTS grants_grant_program_id_8d75710a_fk_divisions_program_id;
ALTER TABLE IF EXISTS ONLY public.email_templates_emailtemplates DROP CONSTRAINT IF EXISTS email_templates_emai_updated_by_id_1c57885f_fk_accounts_;
ALTER TABLE IF EXISTS ONLY public.email_templates_emailtemplates DROP CONSTRAINT IF EXISTS email_templates_emai_created_by_id_801c5250_fk_accounts_;
ALTER TABLE IF EXISTS ONLY public.documents_bankstatementaccessrequest DROP CONSTRAINT IF EXISTS documents_bankstatem_user_id_db88bc28_fk_accounts_;
ALTER TABLE IF EXISTS ONLY public.documents_bankstatementaccessrequest DROP CONSTRAINT IF EXISTS documents_bankstatem_document_id_db16dfa1_fk_documents;
ALTER TABLE IF EXISTS ONLY public.django_celery_beat_periodictask DROP CONSTRAINT IF EXISTS django_celery_beat_p_solar_id_a87ce72c_fk_django_ce;
ALTER TABLE IF EXISTS ONLY public.django_celery_beat_periodictask DROP CONSTRAINT IF EXISTS django_celery_beat_p_interval_id_a8ca27da_fk_django_ce;
ALTER TABLE IF EXISTS ONLY public.django_celery_beat_periodictask DROP CONSTRAINT IF EXISTS django_celery_beat_p_crontab_id_d3cba168_fk_django_ce;
ALTER TABLE IF EXISTS ONLY public.django_celery_beat_periodictask DROP CONSTRAINT IF EXISTS django_celery_beat_p_clocked_id_47a69f82_fk_django_ce;
ALTER TABLE IF EXISTS ONLY public.django_admin_log DROP CONSTRAINT IF EXISTS django_admin_log_user_id_c564eba6_fk_accounts_user_id;
ALTER TABLE IF EXISTS ONLY public.django_admin_log DROP CONSTRAINT IF EXISTS django_admin_log_content_type_id_c4bce8eb_fk_django_co;
ALTER TABLE IF EXISTS ONLY public.divisions_vocationaltrainingprogramtraineedetail DROP CONSTRAINT IF EXISTS divisions_vocational_updated_by_id_7c271473_fk_accounts_;
ALTER TABLE IF EXISTS ONLY public.divisions_vocationaltrainingprogramtrainerdetail DROP CONSTRAINT IF EXISTS divisions_vocational_updated_by_id_6993a9b8_fk_accounts_;
ALTER TABLE IF EXISTS ONLY public.divisions_vocationaltrainingprogramtraineedetail DROP CONSTRAINT IF EXISTS divisions_vocational_trainer_id_d756f924_fk_divisions;
ALTER TABLE IF EXISTS ONLY public.divisions_vocationaltrainingprogramtrainerdetail DROP CONSTRAINT IF EXISTS divisions_vocational_program_id_ecf2f2f2_fk_divisions;
ALTER TABLE IF EXISTS ONLY public.divisions_vocationaltrainingprogramtraineedetail DROP CONSTRAINT IF EXISTS divisions_vocational_created_by_id_79604231_fk_accounts_;
ALTER TABLE IF EXISTS ONLY public.divisions_vocationaltrainingprogramtrainerdetail DROP CONSTRAINT IF EXISTS divisions_vocational_created_by_id_0a1f07ed_fk_accounts_;
ALTER TABLE IF EXISTS ONLY public.divisions_rescueprogramdetail DROP CONSTRAINT IF EXISTS divisions_rescueprog_updated_by_id_ac48ca74_fk_accounts_;
ALTER TABLE IF EXISTS ONLY public.divisions_rescueprogramdetail DROP CONSTRAINT IF EXISTS divisions_rescueprog_program_id_4e745372_fk_divisions;
ALTER TABLE IF EXISTS ONLY public.divisions_rescueprogramdetail DROP CONSTRAINT IF EXISTS divisions_rescueprog_created_by_id_e97050ac_fk_accounts_;
ALTER TABLE IF EXISTS ONLY public.divisions_program_maintainers DROP CONSTRAINT IF EXISTS divisions_program_ma_user_id_1b5f848b_fk_accounts_;
ALTER TABLE IF EXISTS ONLY public.divisions_program_maintainers DROP CONSTRAINT IF EXISTS divisions_program_ma_program_id_8a24a2b1_fk_divisions;
ALTER TABLE IF EXISTS ONLY public.divisions_program DROP CONSTRAINT IF EXISTS divisions_program_division_id_82095a01_fk_divisions_division_id;
ALTER TABLE IF EXISTS ONLY public.divisions_microfundprogramdetail DROP CONSTRAINT IF EXISTS divisions_microfundp_updated_by_id_bd2f8346_fk_accounts_;
ALTER TABLE IF EXISTS ONLY public.divisions_microfundprogramdetail DROP CONSTRAINT IF EXISTS divisions_microfundp_program_id_af965baa_fk_divisions;
ALTER TABLE IF EXISTS ONLY public.divisions_microfundprogramdetail DROP CONSTRAINT IF EXISTS divisions_microfundp_created_by_id_bed73eec_fk_accounts_;
ALTER TABLE IF EXISTS ONLY public.divisions_educationprogramdetail DROP CONSTRAINT IF EXISTS divisions_educationp_updated_by_id_4b7910f2_fk_accounts_;
ALTER TABLE IF EXISTS ONLY public.divisions_educationprogramdetail DROP CONSTRAINT IF EXISTS divisions_educationp_program_id_247df82c_fk_divisions;
ALTER TABLE IF EXISTS ONLY public.divisions_educationprogramdetail DROP CONSTRAINT IF EXISTS divisions_educationp_created_by_id_27d523e7_fk_accounts_;
ALTER TABLE IF EXISTS ONLY public.divisions_division_leads DROP CONSTRAINT IF EXISTS divisions_division_leads_user_id_e5c33636_fk_accounts_user_id;
ALTER TABLE IF EXISTS ONLY public.divisions_division_leads DROP CONSTRAINT IF EXISTS divisions_division_l_division_id_0529c80f_fk_divisions;
ALTER TABLE IF EXISTS ONLY public.core_recyclebinitem DROP CONSTRAINT IF EXISTS core_recyclebinitem_restored_by_id_2ccd7e28_fk_accounts_user_id;
ALTER TABLE IF EXISTS ONLY public.core_recyclebinitem DROP CONSTRAINT IF EXISTS core_recyclebinitem_deleted_by_id_73cc7883_fk_accounts_user_id;
ALTER TABLE IF EXISTS ONLY public.core_recyclebinitem DROP CONSTRAINT IF EXISTS core_recyclebinitem_content_type_id_f87b9c19_fk_django_co;
ALTER TABLE IF EXISTS ONLY public.authtoken_token DROP CONSTRAINT IF EXISTS authtoken_token_user_id_35299eff_fk_accounts_user_id;
ALTER TABLE IF EXISTS ONLY public.auth_permission DROP CONSTRAINT IF EXISTS auth_permission_content_type_id_2f476e4b_fk_django_co;
ALTER TABLE IF EXISTS ONLY public.auth_group_permissions DROP CONSTRAINT IF EXISTS auth_group_permissions_group_id_b120cbf9_fk_auth_group_id;
ALTER TABLE IF EXISTS ONLY public.auth_group_permissions DROP CONSTRAINT IF EXISTS auth_group_permissio_permission_id_84c5c92e_fk_auth_perm;
ALTER TABLE IF EXISTS ONLY public.accounts_user_user_permissions DROP CONSTRAINT IF EXISTS accounts_user_user_p_user_id_e4f0a161_fk_accounts_;
ALTER TABLE IF EXISTS ONLY public.accounts_user_user_permissions DROP CONSTRAINT IF EXISTS accounts_user_user_p_permission_id_113bb443_fk_auth_perm;
ALTER TABLE IF EXISTS ONLY public.accounts_user_groups DROP CONSTRAINT IF EXISTS accounts_user_groups_user_id_52b62117_fk_accounts_user_id;
ALTER TABLE IF EXISTS ONLY public.accounts_user_groups DROP CONSTRAINT IF EXISTS accounts_user_groups_group_id_bd11a704_fk_auth_group_id;
DROP INDEX IF EXISTS public.token_blacklist_outstandingtoken_user_id_83bc629a;
DROP INDEX IF EXISTS public.token_blacklist_outstandingtoken_jti_hex_d9bdf6f7_like;
DROP INDEX IF EXISTS public.task_manager_task_grant_id_5dd5c3dd;
DROP INDEX IF EXISTS public.task_manager_task_assigned_to_id_aaf7f5f9;
DROP INDEX IF EXISTS public.task_manager_task_assigned_by_id_94ddebb1;
DROP INDEX IF EXISTS public.notifications_notification_recipient_id_d055f3f0;
DROP INDEX IF EXISTS public.notifications_notification_assigner_id_9af7d917;
DROP INDEX IF EXISTS public.grants_grant_submitted_documents_grant_id_6e327786;
DROP INDEX IF EXISTS public.grants_grant_submitted_documents_document_id_a248f8a0;
DROP INDEX IF EXISTS public.grants_grant_submitted_by_id_fabea75b;
DROP INDEX IF EXISTS public.grants_grant_required_documents_grant_id_125e5d91;
DROP INDEX IF EXISTS public.grants_grant_required_documents_document_id_75244ebb;
DROP INDEX IF EXISTS public.grants_grant_program_id_8d75710a;
DROP INDEX IF EXISTS public.email_templates_emailtemplates_updated_by_id_1c57885f;
DROP INDEX IF EXISTS public.email_templates_emailtemplates_created_by_id_801c5250;
DROP INDEX IF EXISTS public.documents_document_name_aaa90b9f_like;
DROP INDEX IF EXISTS public.documents_bankstatementaccessrequest_user_id_db88bc28;
DROP INDEX IF EXISTS public.documents_bankstatementaccessrequest_document_id_db16dfa1;
DROP INDEX IF EXISTS public.django_session_session_key_c0390e0f_like;
DROP INDEX IF EXISTS public.django_session_expire_date_a5c62663;
DROP INDEX IF EXISTS public.django_celery_beat_periodictask_solar_id_a87ce72c;
DROP INDEX IF EXISTS public.django_celery_beat_periodictask_name_265a36b7_like;
DROP INDEX IF EXISTS public.django_celery_beat_periodictask_interval_id_a8ca27da;
DROP INDEX IF EXISTS public.django_celery_beat_periodictask_crontab_id_d3cba168;
DROP INDEX IF EXISTS public.django_celery_beat_periodictask_clocked_id_47a69f82;
DROP INDEX IF EXISTS public.django_admin_log_user_id_c564eba6;
DROP INDEX IF EXISTS public.django_admin_log_content_type_id_c4bce8eb;
DROP INDEX IF EXISTS public.divisions_vocationaltraini_updated_by_id_7c271473;
DROP INDEX IF EXISTS public.divisions_vocationaltraini_updated_by_id_6993a9b8;
DROP INDEX IF EXISTS public.divisions_vocationaltraini_trainer_id_d756f924;
DROP INDEX IF EXISTS public.divisions_vocationaltraini_program_id_ecf2f2f2;
DROP INDEX IF EXISTS public.divisions_vocationaltraini_created_by_id_79604231;
DROP INDEX IF EXISTS public.divisions_vocationaltraini_created_by_id_0a1f07ed;
DROP INDEX IF EXISTS public.divisions_vocationaltrai_trainer_name_1023b156_like;
DROP INDEX IF EXISTS public.divisions_vocationaltrai_trainee_name_a2db428b_like;
DROP INDEX IF EXISTS public.divisions_rescueprogramdetail_updated_by_id_ac48ca74;
DROP INDEX IF EXISTS public.divisions_rescueprogramdetail_program_id_4e745372;
DROP INDEX IF EXISTS public.divisions_rescueprogramdetail_created_by_id_e97050ac;
DROP INDEX IF EXISTS public.divisions_rescueprogramdetail_child_name_792ff1df_like;
DROP INDEX IF EXISTS public.divisions_program_name_55f4dea5_like;
DROP INDEX IF EXISTS public.divisions_program_maintainers_user_id_1b5f848b;
DROP INDEX IF EXISTS public.divisions_program_maintainers_program_id_8a24a2b1;
DROP INDEX IF EXISTS public.divisions_program_division_id_82095a01;
DROP INDEX IF EXISTS public.divisions_microfundprogramdetail_updated_by_id_bd2f8346;
DROP INDEX IF EXISTS public.divisions_microfundprogramdetail_program_id_af965baa;
DROP INDEX IF EXISTS public.divisions_microfundprogramdetail_person_name_a45e9f68_like;
DROP INDEX IF EXISTS public.divisions_microfundprogramdetail_created_by_id_bed73eec;
DROP INDEX IF EXISTS public.divisions_educationprogramdetail_updated_by_id_4b7910f2;
DROP INDEX IF EXISTS public.divisions_educationprogramdetail_student_name_405f18ee_like;
DROP INDEX IF EXISTS public.divisions_educationprogramdetail_program_id_247df82c;
DROP INDEX IF EXISTS public.divisions_educationprogramdetail_created_by_id_27d523e7;
DROP INDEX IF EXISTS public.divisions_division_name_b3a1b021_like;
DROP INDEX IF EXISTS public.divisions_division_leads_user_id_e5c33636;
DROP INDEX IF EXISTS public.divisions_division_leads_division_id_0529c80f;
DROP INDEX IF EXISTS public.core_recyclebinitem_restored_by_id_2ccd7e28;
DROP INDEX IF EXISTS public.core_recyclebinitem_deleted_by_id_73cc7883;
DROP INDEX IF EXISTS public.core_recyclebinitem_content_type_id_f87b9c19;
DROP INDEX IF EXISTS public.authtoken_token_key_10f0b77e_like;
DROP INDEX IF EXISTS public.auth_permission_content_type_id_2f476e4b;
DROP INDEX IF EXISTS public.auth_group_permissions_permission_id_84c5c92e;
DROP INDEX IF EXISTS public.auth_group_permissions_group_id_b120cbf9;
DROP INDEX IF EXISTS public.auth_group_name_a6ea08ec_like;
DROP INDEX IF EXISTS public.accounts_user_user_permissions_user_id_e4f0a161;
DROP INDEX IF EXISTS public.accounts_user_user_permissions_permission_id_113bb443;
DROP INDEX IF EXISTS public.accounts_user_groups_user_id_52b62117;
DROP INDEX IF EXISTS public.accounts_user_groups_group_id_bd11a704;
DROP INDEX IF EXISTS public.accounts_user_email_b2644a56_like;
ALTER TABLE IF EXISTS ONLY public.token_blacklist_outstandingtoken DROP CONSTRAINT IF EXISTS token_blacklist_outstandingtoken_pkey;
ALTER TABLE IF EXISTS ONLY public.token_blacklist_outstandingtoken DROP CONSTRAINT IF EXISTS token_blacklist_outstandingtoken_jti_hex_d9bdf6f7_uniq;
ALTER TABLE IF EXISTS ONLY public.token_blacklist_blacklistedtoken DROP CONSTRAINT IF EXISTS token_blacklist_blacklistedtoken_token_id_key;
ALTER TABLE IF EXISTS ONLY public.token_blacklist_blacklistedtoken DROP CONSTRAINT IF EXISTS token_blacklist_blacklistedtoken_pkey;
ALTER TABLE IF EXISTS ONLY public.task_manager_task DROP CONSTRAINT IF EXISTS task_manager_task_pkey;
ALTER TABLE IF EXISTS ONLY public.notifications_notification DROP CONSTRAINT IF EXISTS notifications_notification_pkey;
ALTER TABLE IF EXISTS ONLY public.grants_grantexpenditure DROP CONSTRAINT IF EXISTS grants_grantexpenditure_pkey;
ALTER TABLE IF EXISTS ONLY public.grants_grantexpenditure DROP CONSTRAINT IF EXISTS grants_grantexpenditure_grant_id_key;
ALTER TABLE IF EXISTS ONLY public.grants_grant_submitted_documents DROP CONSTRAINT IF EXISTS grants_grant_submitted_documents_pkey;
ALTER TABLE IF EXISTS ONLY public.grants_grant_submitted_documents DROP CONSTRAINT IF EXISTS grants_grant_submitted_d_grant_id_document_id_05b56453_uniq;
ALTER TABLE IF EXISTS ONLY public.grants_grant_required_documents DROP CONSTRAINT IF EXISTS grants_grant_required_documents_pkey;
ALTER TABLE IF EXISTS ONLY public.grants_grant_required_documents DROP CONSTRAINT IF EXISTS grants_grant_required_do_grant_id_document_id_83bd28e0_uniq;
ALTER TABLE IF EXISTS ONLY public.grants_grant DROP CONSTRAINT IF EXISTS grants_grant_pkey;
ALTER TABLE IF EXISTS ONLY public.email_templates_emailtemplates DROP CONSTRAINT IF EXISTS email_templates_emailtemplates_pkey;
ALTER TABLE IF EXISTS ONLY public.documents_document DROP CONSTRAINT IF EXISTS documents_document_pkey;
ALTER TABLE IF EXISTS ONLY public.documents_document DROP CONSTRAINT IF EXISTS documents_document_name_aaa90b9f_uniq;
ALTER TABLE IF EXISTS ONLY public.documents_bankstatementaccessrequest DROP CONSTRAINT IF EXISTS documents_bankstatementaccessrequest_pkey;
ALTER TABLE IF EXISTS ONLY public.django_session DROP CONSTRAINT IF EXISTS django_session_pkey;
ALTER TABLE IF EXISTS ONLY public.django_migrations DROP CONSTRAINT IF EXISTS django_migrations_pkey;
ALTER TABLE IF EXISTS ONLY public.django_content_type DROP CONSTRAINT IF EXISTS django_content_type_pkey;
ALTER TABLE IF EXISTS ONLY public.django_content_type DROP CONSTRAINT IF EXISTS django_content_type_app_label_model_76bd3d3b_uniq;
ALTER TABLE IF EXISTS ONLY public.django_celery_beat_solarschedule DROP CONSTRAINT IF EXISTS django_celery_beat_solarschedule_pkey;
ALTER TABLE IF EXISTS ONLY public.django_celery_beat_solarschedule DROP CONSTRAINT IF EXISTS django_celery_beat_solar_event_latitude_longitude_ba64999a_uniq;
ALTER TABLE IF EXISTS ONLY public.django_celery_beat_periodictasks DROP CONSTRAINT IF EXISTS django_celery_beat_periodictasks_pkey;
ALTER TABLE IF EXISTS ONLY public.django_celery_beat_periodictask DROP CONSTRAINT IF EXISTS django_celery_beat_periodictask_pkey;
ALTER TABLE IF EXISTS ONLY public.django_celery_beat_periodictask DROP CONSTRAINT IF EXISTS django_celery_beat_periodictask_name_key;
ALTER TABLE IF EXISTS ONLY public.django_celery_beat_intervalschedule DROP CONSTRAINT IF EXISTS django_celery_beat_intervalschedule_pkey;
ALTER TABLE IF EXISTS ONLY public.django_celery_beat_crontabschedule DROP CONSTRAINT IF EXISTS django_celery_beat_crontabschedule_pkey;
ALTER TABLE IF EXISTS ONLY public.django_celery_beat_clockedschedule DROP CONSTRAINT IF EXISTS django_celery_beat_clockedschedule_pkey;
ALTER TABLE IF EXISTS ONLY public.django_admin_log DROP CONSTRAINT IF EXISTS django_admin_log_pkey;
ALTER TABLE IF EXISTS ONLY public.divisions_vocationaltrainingprogramtrainerdetail DROP CONSTRAINT IF EXISTS divisions_vocationaltrainingprogramtrainerdetail_pkey;
ALTER TABLE IF EXISTS ONLY public.divisions_vocationaltrainingprogramtrainerdetail DROP CONSTRAINT IF EXISTS divisions_vocationaltrainingprogramtrainerdeta_trainer_name_key;
ALTER TABLE IF EXISTS ONLY public.divisions_vocationaltrainingprogramtraineedetail DROP CONSTRAINT IF EXISTS divisions_vocationaltrainingprogramtraineedetail_pkey;
ALTER TABLE IF EXISTS ONLY public.divisions_vocationaltrainingprogramtraineedetail DROP CONSTRAINT IF EXISTS divisions_vocationaltrainingprogramtraineedeta_trainee_name_key;
ALTER TABLE IF EXISTS ONLY public.divisions_rescueprogramdetail DROP CONSTRAINT IF EXISTS divisions_rescueprogramdetail_pkey;
ALTER TABLE IF EXISTS ONLY public.divisions_rescueprogramdetail DROP CONSTRAINT IF EXISTS divisions_rescueprogramdetail_child_name_key;
ALTER TABLE IF EXISTS ONLY public.divisions_program DROP CONSTRAINT IF EXISTS divisions_program_pkey;
ALTER TABLE IF EXISTS ONLY public.divisions_program DROP CONSTRAINT IF EXISTS divisions_program_name_key;
ALTER TABLE IF EXISTS ONLY public.divisions_program_maintainers DROP CONSTRAINT IF EXISTS divisions_program_maintainers_program_id_user_id_527d8fa1_uniq;
ALTER TABLE IF EXISTS ONLY public.divisions_program_maintainers DROP CONSTRAINT IF EXISTS divisions_program_maintainers_pkey;
ALTER TABLE IF EXISTS ONLY public.divisions_microfundprogramdetail DROP CONSTRAINT IF EXISTS divisions_microfundprogramdetail_pkey;
ALTER TABLE IF EXISTS ONLY public.divisions_microfundprogramdetail DROP CONSTRAINT IF EXISTS divisions_microfundprogramdetail_person_name_key;
ALTER TABLE IF EXISTS ONLY public.divisions_educationprogramdetail DROP CONSTRAINT IF EXISTS divisions_educationprogramdetail_student_name_key;
ALTER TABLE IF EXISTS ONLY public.divisions_educationprogramdetail DROP CONSTRAINT IF EXISTS divisions_educationprogramdetail_pkey;
ALTER TABLE IF EXISTS ONLY public.divisions_division DROP CONSTRAINT IF EXISTS divisions_division_pkey;
ALTER TABLE IF EXISTS ONLY public.divisions_division DROP CONSTRAINT IF EXISTS divisions_division_name_key;
ALTER TABLE IF EXISTS ONLY public.divisions_division_leads DROP CONSTRAINT IF EXISTS divisions_division_leads_pkey;
ALTER TABLE IF EXISTS ONLY public.divisions_division_leads DROP CONSTRAINT IF EXISTS divisions_division_leads_division_id_user_id_85d42e10_uniq;
ALTER TABLE IF EXISTS ONLY public.core_recyclebinitem DROP CONSTRAINT IF EXISTS core_recyclebinitem_pkey;
ALTER TABLE IF EXISTS ONLY public.authtoken_token DROP CONSTRAINT IF EXISTS authtoken_token_user_id_key;
ALTER TABLE IF EXISTS ONLY public.authtoken_token DROP CONSTRAINT IF EXISTS authtoken_token_pkey;
ALTER TABLE IF EXISTS ONLY public.auth_permission DROP CONSTRAINT IF EXISTS auth_permission_pkey;
ALTER TABLE IF EXISTS ONLY public.auth_permission DROP CONSTRAINT IF EXISTS auth_permission_content_type_id_codename_01ab375a_uniq;
ALTER TABLE IF EXISTS ONLY public.auth_group DROP CONSTRAINT IF EXISTS auth_group_pkey;
ALTER TABLE IF EXISTS ONLY public.auth_group_permissions DROP CONSTRAINT IF EXISTS auth_group_permissions_pkey;
ALTER TABLE IF EXISTS ONLY public.auth_group_permissions DROP CONSTRAINT IF EXISTS auth_group_permissions_group_id_permission_id_0cd325b0_uniq;
ALTER TABLE IF EXISTS ONLY public.auth_group DROP CONSTRAINT IF EXISTS auth_group_name_key;
ALTER TABLE IF EXISTS ONLY public.accounts_user_user_permissions DROP CONSTRAINT IF EXISTS accounts_user_user_permissions_pkey;
ALTER TABLE IF EXISTS ONLY public.accounts_user_user_permissions DROP CONSTRAINT IF EXISTS accounts_user_user_permi_user_id_permission_id_2ab516c2_uniq;
ALTER TABLE IF EXISTS ONLY public.accounts_user DROP CONSTRAINT IF EXISTS accounts_user_pkey;
ALTER TABLE IF EXISTS ONLY public.accounts_user_groups DROP CONSTRAINT IF EXISTS accounts_user_groups_user_id_group_id_59c0b32f_uniq;
ALTER TABLE IF EXISTS ONLY public.accounts_user_groups DROP CONSTRAINT IF EXISTS accounts_user_groups_pkey;
ALTER TABLE IF EXISTS ONLY public.accounts_user DROP CONSTRAINT IF EXISTS accounts_user_email_key;
DROP TABLE IF EXISTS public.token_blacklist_outstandingtoken;
DROP TABLE IF EXISTS public.token_blacklist_blacklistedtoken;
DROP TABLE IF EXISTS public.task_manager_task;
DROP TABLE IF EXISTS public.notifications_notification;
DROP TABLE IF EXISTS public.grants_grantexpenditure;
DROP TABLE IF EXISTS public.grants_grant_submitted_documents;
DROP TABLE IF EXISTS public.grants_grant_required_documents;
DROP TABLE IF EXISTS public.grants_grant;
DROP TABLE IF EXISTS public.email_templates_emailtemplates;
DROP TABLE IF EXISTS public.documents_document;
DROP TABLE IF EXISTS public.documents_bankstatementaccessrequest;
DROP TABLE IF EXISTS public.django_session;
DROP TABLE IF EXISTS public.django_migrations;
DROP TABLE IF EXISTS public.django_content_type;
DROP TABLE IF EXISTS public.django_celery_beat_solarschedule;
DROP TABLE IF EXISTS public.django_celery_beat_periodictasks;
DROP TABLE IF EXISTS public.django_celery_beat_periodictask;
DROP TABLE IF EXISTS public.django_celery_beat_intervalschedule;
DROP TABLE IF EXISTS public.django_celery_beat_crontabschedule;
DROP TABLE IF EXISTS public.django_celery_beat_clockedschedule;
DROP TABLE IF EXISTS public.django_admin_log;
DROP TABLE IF EXISTS public.divisions_vocationaltrainingprogramtrainerdetail;
DROP TABLE IF EXISTS public.divisions_vocationaltrainingprogramtraineedetail;
DROP TABLE IF EXISTS public.divisions_rescueprogramdetail;
DROP TABLE IF EXISTS public.divisions_program_maintainers;
DROP TABLE IF EXISTS public.divisions_program;
DROP TABLE IF EXISTS public.divisions_microfundprogramdetail;
DROP TABLE IF EXISTS public.divisions_educationprogramdetail;
DROP TABLE IF EXISTS public.divisions_division_leads;
DROP TABLE IF EXISTS public.divisions_division;
DROP TABLE IF EXISTS public.core_recyclebinitem;
DROP TABLE IF EXISTS public.authtoken_token;
DROP TABLE IF EXISTS public.auth_permission;
DROP TABLE IF EXISTS public.auth_group_permissions;
DROP TABLE IF EXISTS public.auth_group;
DROP TABLE IF EXISTS public.accounts_user_user_permissions;
DROP TABLE IF EXISTS public.accounts_user_groups;
DROP TABLE IF EXISTS public.accounts_user;
SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: accounts_user; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.accounts_user (
    password character varying(128) NOT NULL,
    last_login timestamp with time zone,
    is_superuser boolean NOT NULL,
    date_joined timestamp with time zone NOT NULL,
    id uuid NOT NULL,
    full_name character varying(100) NOT NULL,
    phone_number character varying(15),
    email character varying(254) NOT NULL,
    role character varying(20) NOT NULL,
    profile_picture character varying(255),
    location character varying(100),
    is_active boolean NOT NULL,
    is_staff boolean NOT NULL,
    date_created timestamp with time zone NOT NULL,
    date_updated timestamp with time zone NOT NULL
);


--
-- Name: accounts_user_groups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.accounts_user_groups (
    id bigint NOT NULL,
    user_id uuid NOT NULL,
    group_id integer NOT NULL
);


--
-- Name: accounts_user_groups_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.accounts_user_groups ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.accounts_user_groups_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: accounts_user_user_permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.accounts_user_user_permissions (
    id bigint NOT NULL,
    user_id uuid NOT NULL,
    permission_id integer NOT NULL
);


--
-- Name: accounts_user_user_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.accounts_user_user_permissions ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.accounts_user_user_permissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: auth_group; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.auth_group (
    id integer NOT NULL,
    name character varying(150) NOT NULL
);


--
-- Name: auth_group_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.auth_group ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.auth_group_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: auth_group_permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.auth_group_permissions (
    id bigint NOT NULL,
    group_id integer NOT NULL,
    permission_id integer NOT NULL
);


--
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.auth_group_permissions ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.auth_group_permissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: auth_permission; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.auth_permission (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    content_type_id integer NOT NULL,
    codename character varying(100) NOT NULL
);


--
-- Name: auth_permission_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.auth_permission ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.auth_permission_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: authtoken_token; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.authtoken_token (
    key character varying(40) NOT NULL,
    created timestamp with time zone NOT NULL,
    user_id uuid NOT NULL
);


--
-- Name: core_recyclebinitem; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.core_recyclebinitem (
    id bigint NOT NULL,
    object_id_int integer,
    object_id_uuid uuid,
    original_data jsonb NOT NULL,
    deleted_at timestamp with time zone NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    restored_at timestamp with time zone,
    content_type_id integer NOT NULL,
    deleted_by_id uuid,
    restored_by_id uuid,
    CONSTRAINT core_recyclebinitem_object_id_int_check CHECK ((object_id_int >= 0))
);


--
-- Name: core_recyclebinitem_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.core_recyclebinitem ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.core_recyclebinitem_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: divisions_division; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.divisions_division (
    name character varying(100) NOT NULL,
    id uuid NOT NULL,
    description text NOT NULL,
    date_created timestamp with time zone NOT NULL,
    date_updated timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone,
    is_deleted boolean NOT NULL
);


--
-- Name: divisions_division_leads; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.divisions_division_leads (
    id bigint NOT NULL,
    division_id uuid NOT NULL,
    user_id uuid NOT NULL
);


--
-- Name: divisions_division_leads_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.divisions_division_leads ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.divisions_division_leads_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: divisions_educationprogramdetail; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.divisions_educationprogramdetail (
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    id uuid NOT NULL,
    student_name character varying(255) NOT NULL,
    gender character varying(20),
    education_level character varying(255) NOT NULL,
    student_location character varying(255) NOT NULL,
    student_contact character varying(255),
    start_date date,
    end_date date,
    school_associated character varying(255),
    created_by_id uuid,
    updated_by_id uuid,
    program_id uuid NOT NULL,
    deleted_at timestamp with time zone,
    is_deleted boolean NOT NULL
);


--
-- Name: divisions_microfundprogramdetail; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.divisions_microfundprogramdetail (
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    id uuid NOT NULL,
    person_name character varying(255) NOT NULL,
    gender character varying(20),
    chama_group character varying(255) NOT NULL,
    is_active boolean NOT NULL,
    start_date date NOT NULL,
    location character varying(255) NOT NULL,
    telephone character varying(20) NOT NULL,
    created_by_id uuid,
    updated_by_id uuid,
    program_id uuid NOT NULL,
    deleted_at timestamp with time zone,
    is_deleted boolean NOT NULL
);


--
-- Name: divisions_program; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.divisions_program (
    name character varying(100) NOT NULL,
    id uuid NOT NULL,
    description text NOT NULL,
    monthly_budget numeric(10,2) NOT NULL,
    annual_budget numeric(10,2) NOT NULL,
    date_created timestamp with time zone NOT NULL,
    date_updated timestamp with time zone NOT NULL,
    division_id uuid NOT NULL,
    deleted_at timestamp with time zone,
    is_deleted boolean NOT NULL
);


--
-- Name: divisions_program_maintainers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.divisions_program_maintainers (
    id bigint NOT NULL,
    program_id uuid NOT NULL,
    user_id uuid NOT NULL
);


--
-- Name: divisions_program_maintainers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.divisions_program_maintainers ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.divisions_program_maintainers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: divisions_rescueprogramdetail; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.divisions_rescueprogramdetail (
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    id uuid NOT NULL,
    child_name character varying(255) NOT NULL,
    gender character varying(20),
    is_reunited boolean NOT NULL,
    under_care boolean NOT NULL,
    date_joined date NOT NULL,
    date_reunited date,
    age integer NOT NULL,
    place_found character varying(255) NOT NULL,
    rescuer_contact character varying(20),
    notes text,
    created_by_id uuid,
    program_id uuid NOT NULL,
    updated_by_id uuid,
    deleted_at timestamp with time zone,
    is_deleted boolean NOT NULL
);


--
-- Name: divisions_vocationaltrainingprogramtraineedetail; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.divisions_vocationaltrainingprogramtraineedetail (
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    id uuid NOT NULL,
    trainee_name character varying(255) NOT NULL,
    gender character varying(20),
    trainee_phone character varying(20) NOT NULL,
    trainee_email character varying(254) NOT NULL,
    trainee_association character varying(255) NOT NULL,
    date_enrolled date NOT NULL,
    under_training boolean NOT NULL,
    created_by_id uuid,
    updated_by_id uuid,
    trainer_id uuid NOT NULL,
    deleted_at timestamp with time zone,
    is_deleted boolean NOT NULL
);


--
-- Name: divisions_vocationaltrainingprogramtrainerdetail; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.divisions_vocationaltrainingprogramtrainerdetail (
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    id uuid NOT NULL,
    trainer_name character varying(255) NOT NULL,
    gender character varying(20),
    trainer_association character varying(255) NOT NULL,
    trainer_phone character varying(20) NOT NULL,
    trainer_email character varying(254) NOT NULL,
    created_by_id uuid,
    program_id uuid NOT NULL,
    updated_by_id uuid,
    deleted_at timestamp with time zone,
    is_deleted boolean NOT NULL
);


--
-- Name: django_admin_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.django_admin_log (
    id integer NOT NULL,
    action_time timestamp with time zone NOT NULL,
    object_id text,
    object_repr character varying(200) NOT NULL,
    action_flag smallint NOT NULL,
    change_message text NOT NULL,
    content_type_id integer,
    user_id uuid NOT NULL,
    CONSTRAINT django_admin_log_action_flag_check CHECK ((action_flag >= 0))
);


--
-- Name: django_admin_log_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.django_admin_log ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.django_admin_log_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: django_celery_beat_clockedschedule; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.django_celery_beat_clockedschedule (
    id integer NOT NULL,
    clocked_time timestamp with time zone NOT NULL
);


--
-- Name: django_celery_beat_clockedschedule_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.django_celery_beat_clockedschedule ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.django_celery_beat_clockedschedule_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: django_celery_beat_crontabschedule; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.django_celery_beat_crontabschedule (
    id integer NOT NULL,
    minute character varying(240) NOT NULL,
    hour character varying(96) NOT NULL,
    day_of_week character varying(64) NOT NULL,
    day_of_month character varying(124) NOT NULL,
    month_of_year character varying(64) NOT NULL,
    timezone character varying(63) NOT NULL
);


--
-- Name: django_celery_beat_crontabschedule_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.django_celery_beat_crontabschedule ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.django_celery_beat_crontabschedule_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: django_celery_beat_intervalschedule; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.django_celery_beat_intervalschedule (
    id integer NOT NULL,
    every integer NOT NULL,
    period character varying(24) NOT NULL
);


--
-- Name: django_celery_beat_intervalschedule_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.django_celery_beat_intervalschedule ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.django_celery_beat_intervalschedule_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: django_celery_beat_periodictask; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.django_celery_beat_periodictask (
    id integer NOT NULL,
    name character varying(200) NOT NULL,
    task character varying(200) NOT NULL,
    args text NOT NULL,
    kwargs text NOT NULL,
    queue character varying(200),
    exchange character varying(200),
    routing_key character varying(200),
    expires timestamp with time zone,
    enabled boolean NOT NULL,
    last_run_at timestamp with time zone,
    total_run_count integer NOT NULL,
    date_changed timestamp with time zone NOT NULL,
    description text NOT NULL,
    crontab_id integer,
    interval_id integer,
    solar_id integer,
    one_off boolean NOT NULL,
    start_time timestamp with time zone,
    priority integer,
    headers text NOT NULL,
    clocked_id integer,
    expire_seconds integer,
    CONSTRAINT django_celery_beat_periodictask_expire_seconds_check CHECK ((expire_seconds >= 0)),
    CONSTRAINT django_celery_beat_periodictask_priority_check CHECK ((priority >= 0)),
    CONSTRAINT django_celery_beat_periodictask_total_run_count_check CHECK ((total_run_count >= 0))
);


--
-- Name: django_celery_beat_periodictask_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.django_celery_beat_periodictask ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.django_celery_beat_periodictask_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: django_celery_beat_periodictasks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.django_celery_beat_periodictasks (
    ident smallint NOT NULL,
    last_update timestamp with time zone NOT NULL
);


--
-- Name: django_celery_beat_solarschedule; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.django_celery_beat_solarschedule (
    id integer NOT NULL,
    event character varying(24) NOT NULL,
    latitude numeric(9,6) NOT NULL,
    longitude numeric(9,6) NOT NULL
);


--
-- Name: django_celery_beat_solarschedule_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.django_celery_beat_solarschedule ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.django_celery_beat_solarschedule_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: django_content_type; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.django_content_type (
    id integer NOT NULL,
    app_label character varying(100) NOT NULL,
    model character varying(100) NOT NULL
);


--
-- Name: django_content_type_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.django_content_type ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.django_content_type_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: django_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.django_migrations (
    id bigint NOT NULL,
    app character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    applied timestamp with time zone NOT NULL
);


--
-- Name: django_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.django_migrations ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.django_migrations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: django_session; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.django_session (
    session_key character varying(40) NOT NULL,
    session_data text NOT NULL,
    expire_date timestamp with time zone NOT NULL
);


--
-- Name: documents_bankstatementaccessrequest; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.documents_bankstatementaccessrequest (
    id bigint NOT NULL,
    pin uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    is_granted boolean NOT NULL,
    document_id bigint NOT NULL,
    user_id uuid NOT NULL
);


--
-- Name: documents_bankstatementaccessrequest_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.documents_bankstatementaccessrequest ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.documents_bankstatementaccessrequest_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: documents_document; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.documents_document (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    description text NOT NULL,
    document_type character varying(50) NOT NULL,
    document_format character varying(20) NOT NULL,
    document_link character varying(200) NOT NULL,
    division character varying(20) NOT NULL,
    date_uploaded timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone,
    is_deleted boolean NOT NULL
);


--
-- Name: documents_document_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.documents_document ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.documents_document_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: email_templates_emailtemplates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.email_templates_emailtemplates (
    name character varying(100) NOT NULL,
    id uuid NOT NULL,
    template_type character varying(50) NOT NULL,
    subject_template character varying(255) NOT NULL,
    body_template text NOT NULL,
    date_created timestamp with time zone NOT NULL,
    last_updated timestamp with time zone NOT NULL,
    created_by_id uuid,
    updated_by_id uuid,
    deleted_at timestamp with time zone,
    is_deleted boolean NOT NULL
);


--
-- Name: grants_grant; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.grants_grant (
    organization_name character varying(255) NOT NULL,
    id uuid NOT NULL,
    application_link character varying(200),
    amount_currency character varying(10) NOT NULL,
    amount_value numeric(15,2) NOT NULL,
    notes text NOT NULL,
    status character varying(10) NOT NULL,
    contact_tel character varying(20) NOT NULL,
    contact_email character varying(254) NOT NULL,
    location character varying(255) NOT NULL,
    organization_type character varying(20) NOT NULL,
    application_deadline date,
    award_date date,
    date_created timestamp with time zone NOT NULL,
    date_updated timestamp with time zone NOT NULL,
    program_id uuid,
    submitted_by_id uuid,
    deleted_at timestamp with time zone,
    is_deleted boolean NOT NULL
);


--
-- Name: grants_grant_required_documents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.grants_grant_required_documents (
    id bigint NOT NULL,
    grant_id uuid NOT NULL,
    document_id bigint NOT NULL
);


--
-- Name: grants_grant_required_documents_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.grants_grant_required_documents ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.grants_grant_required_documents_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: grants_grant_submitted_documents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.grants_grant_submitted_documents (
    id bigint NOT NULL,
    grant_id uuid NOT NULL,
    document_id bigint NOT NULL
);


--
-- Name: grants_grant_submitted_documents_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.grants_grant_submitted_documents ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.grants_grant_submitted_documents_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: grants_grantexpenditure; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.grants_grantexpenditure (
    id uuid NOT NULL,
    amount_used numeric(15,2) NOT NULL,
    estimated_depletion_date date,
    grant_id uuid NOT NULL,
    deleted_at timestamp with time zone,
    is_deleted boolean NOT NULL
);


--
-- Name: notifications_notification; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notifications_notification (
    id uuid NOT NULL,
    message text NOT NULL,
    notification_type character varying(50) NOT NULL,
    read_status boolean NOT NULL,
    created_at timestamp with time zone NOT NULL,
    link character varying(200),
    recipient_id uuid NOT NULL,
    assigner_id uuid
);


--
-- Name: task_manager_task; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.task_manager_task (
    title character varying(255) NOT NULL,
    id uuid NOT NULL,
    description text,
    status character varying(20) NOT NULL,
    priority character varying(20) NOT NULL,
    due_date date,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    is_grant_follow_up_task boolean NOT NULL,
    assigned_by_id uuid,
    assigned_to_id uuid,
    grant_id uuid
);


--
-- Name: token_blacklist_blacklistedtoken; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.token_blacklist_blacklistedtoken (
    id bigint NOT NULL,
    blacklisted_at timestamp with time zone NOT NULL,
    token_id bigint NOT NULL
);


--
-- Name: token_blacklist_blacklistedtoken_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.token_blacklist_blacklistedtoken ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.token_blacklist_blacklistedtoken_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: token_blacklist_outstandingtoken; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.token_blacklist_outstandingtoken (
    id bigint NOT NULL,
    token text NOT NULL,
    created_at timestamp with time zone,
    expires_at timestamp with time zone NOT NULL,
    user_id uuid,
    jti character varying(255) NOT NULL
);


--
-- Name: token_blacklist_outstandingtoken_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.token_blacklist_outstandingtoken ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.token_blacklist_outstandingtoken_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Data for Name: accounts_user; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.accounts_user (password, last_login, is_superuser, date_joined, id, full_name, phone_number, email, role, profile_picture, location, is_active, is_staff, date_created, date_updated) FROM stdin;
pbkdf2_sha256$1000000$HgiGyBEMsdNL3eMKbgQV2f$7OKg8q/O5PGtu40NwrGvkZBY8k7y6Dz8JMpRpZiuaPQ=	\N	f	2025-05-26 16:27:55.498173+03	bc1a3b21-3f45-4165-82cc-308b1f97ae91	Paul	0796921547	paul@nisria.co	grant_officer	\N	Nairobi	t	f	2025-05-26 16:27:58.649466+03	2025-05-26 16:27:58.649513+03
pbkdf2_sha256$1000000$cl4Ved9Mq32QW42nHTjPx8$eliyMN9/SlLDkGxh0SMSEyRlkNW7xqPv9CAADzHyXGM=	\N	f	2025-05-26 16:29:05.015646+03	22ebe5a7-ef0f-4829-9fac-9f5e04d0f6fb	Malik	0796921547	malik@nisria.co	management_lead	\N	Mombasa	t	t	2025-05-26 16:29:08.037985+03	2025-05-26 16:29:08.038012+03
pbkdf2_sha256$1000000$eXY0d8JGxkcsFKeegciluc$tPtIqEzCyCMeHBsWbYM2RPKfuucLgVA/NhFBEf093sk=	\N	f	2025-05-26 16:30:17.424855+03	f0169040-145e-4abb-ad6c-986e9ed08e9e	Malik	0796921547	kimmanasseh14@nisria.co	admin	\N	Mombasa	t	t	2025-05-26 16:30:20.750553+03	2025-05-26 16:30:20.750601+03
pbkdf2_sha256$1000000$VmvG7o0zY0vfw2U8qruB5u$A9IZmIxk6ahP+MNH1Jaa2eod8/aK2ZMdioUwzTYTRPc=	\N	f	2025-05-29 17:00:22.893087+03	b241024b-e362-4681-b9cf-c9b09ab498db	charles	0796921547	charles@nisria.co	super_admin	\N	Mombasa	t	t	2025-05-29 17:00:26.103186+03	2025-05-29 17:00:26.103249+03
pbkdf2_sha256$1000000$fTQmnafRkNMSANMQS4y2TZ$K9CZ5yX5LCTRGOiYjlNCMDDiABCzc/2f2HD8cOfwObo=	\N	f	2025-06-06 01:25:28.550603+03	40551bcd-83a0-4756-892c-a23d9bae1453	John Doe	0796921547	johndoe@nisria.co	grant_officer	image/upload/v1749162330/profile_pics/jvnq29au5rdtwbinlyrx.png	Nairobi	t	f	2025-06-06 01:25:31.554255+03	2025-06-06 01:25:31.554317+03
pbkdf2_sha256$1000000$tU3fwWL2lzs19FqCKxgO0c$dusU+zV/8uKtnMP1ZtqS7zMQLtwbqTfacqGrJceH0h0=	2025-05-31 16:47:43.171989+03	t	2025-05-26 16:24:37.971078+03	1c033260-5be8-4a59-a8f3-990073f89307	Manasseh Kimani	+2540796921547	gitaumanasseh1@nisria.co	super_admin	image/upload/v1749302400/profile_pics/plsuycktyazewccajhkn.png	\N	t	t	2025-05-26 16:24:39.74753+03	2025-06-07 16:41:23.73316+03
\.


--
-- Data for Name: accounts_user_groups; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.accounts_user_groups (id, user_id, group_id) FROM stdin;
\.


--
-- Data for Name: accounts_user_user_permissions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.accounts_user_user_permissions (id, user_id, permission_id) FROM stdin;
\.


--
-- Data for Name: auth_group; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.auth_group (id, name) FROM stdin;
\.


--
-- Data for Name: auth_group_permissions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.auth_group_permissions (id, group_id, permission_id) FROM stdin;
\.


--
-- Data for Name: auth_permission; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.auth_permission (id, name, content_type_id, codename) FROM stdin;
1	Can add log entry	1	add_logentry
2	Can change log entry	1	change_logentry
3	Can delete log entry	1	delete_logentry
4	Can view log entry	1	view_logentry
5	Can add permission	2	add_permission
6	Can change permission	2	change_permission
7	Can delete permission	2	delete_permission
8	Can view permission	2	view_permission
9	Can add group	3	add_group
10	Can change group	3	change_group
11	Can delete group	3	delete_group
12	Can view group	3	view_group
13	Can add content type	4	add_contenttype
14	Can change content type	4	change_contenttype
15	Can delete content type	4	delete_contenttype
16	Can view content type	4	view_contenttype
17	Can add session	5	add_session
18	Can change session	5	change_session
19	Can delete session	5	delete_session
20	Can view session	5	view_session
21	Can add user	6	add_user
22	Can change user	6	change_user
23	Can delete user	6	delete_user
24	Can view user	6	view_user
25	Can add division	7	add_division
26	Can change division	7	change_division
27	Can delete division	7	delete_division
28	Can view division	7	view_division
29	Can add program	8	add_program
30	Can change program	8	change_program
31	Can delete program	8	delete_program
32	Can view program	8	view_program
33	Can add micro fund program detail	9	add_microfundprogramdetail
34	Can change micro fund program detail	9	change_microfundprogramdetail
35	Can delete micro fund program detail	9	delete_microfundprogramdetail
36	Can view micro fund program detail	9	view_microfundprogramdetail
37	Can add education program detail	10	add_educationprogramdetail
38	Can change education program detail	10	change_educationprogramdetail
39	Can delete education program detail	10	delete_educationprogramdetail
40	Can view education program detail	10	view_educationprogramdetail
41	Can add rescue program detail	11	add_rescueprogramdetail
42	Can change rescue program detail	11	change_rescueprogramdetail
43	Can delete rescue program detail	11	delete_rescueprogramdetail
44	Can view rescue program detail	11	view_rescueprogramdetail
45	Can add vocational training program trainer detail	12	add_vocationaltrainingprogramtrainerdetail
46	Can change vocational training program trainer detail	12	change_vocationaltrainingprogramtrainerdetail
47	Can delete vocational training program trainer detail	12	delete_vocationaltrainingprogramtrainerdetail
48	Can view vocational training program trainer detail	12	view_vocationaltrainingprogramtrainerdetail
49	Can add vocational training program trainee detail	13	add_vocationaltrainingprogramtraineedetail
50	Can change vocational training program trainee detail	13	change_vocationaltrainingprogramtraineedetail
51	Can delete vocational training program trainee detail	13	delete_vocationaltrainingprogramtraineedetail
52	Can view vocational training program trainee detail	13	view_vocationaltrainingprogramtraineedetail
53	Can add document	14	add_document
54	Can change document	14	change_document
55	Can delete document	14	delete_document
56	Can view document	14	view_document
57	Can add bank statement access request	15	add_bankstatementaccessrequest
58	Can change bank statement access request	15	change_bankstatementaccessrequest
59	Can delete bank statement access request	15	delete_bankstatementaccessrequest
60	Can view bank statement access request	15	view_bankstatementaccessrequest
61	Can add grant	16	add_grant
62	Can change grant	16	change_grant
63	Can delete grant	16	delete_grant
64	Can view grant	16	view_grant
65	Can add grant expenditure	17	add_grantexpenditure
66	Can change grant expenditure	17	change_grantexpenditure
67	Can delete grant expenditure	17	delete_grantexpenditure
68	Can view grant expenditure	17	view_grantexpenditure
69	Can add email templates	18	add_emailtemplates
70	Can change email templates	18	change_emailtemplates
71	Can delete email templates	18	delete_emailtemplates
72	Can view email templates	18	view_emailtemplates
73	Can add notification	19	add_notification
74	Can change notification	19	change_notification
75	Can delete notification	19	delete_notification
76	Can view notification	19	view_notification
77	Can add task	20	add_task
78	Can change task	20	change_task
79	Can delete task	20	delete_task
80	Can view task	20	view_task
81	Can add Token	21	add_token
82	Can change Token	21	change_token
83	Can delete Token	21	delete_token
84	Can view Token	21	view_token
85	Can add Token	22	add_tokenproxy
86	Can change Token	22	change_tokenproxy
87	Can delete Token	22	delete_tokenproxy
88	Can view Token	22	view_tokenproxy
89	Can add crontab	23	add_crontabschedule
90	Can change crontab	23	change_crontabschedule
91	Can delete crontab	23	delete_crontabschedule
92	Can view crontab	23	view_crontabschedule
93	Can add interval	24	add_intervalschedule
94	Can change interval	24	change_intervalschedule
95	Can delete interval	24	delete_intervalschedule
96	Can view interval	24	view_intervalschedule
97	Can add periodic task	25	add_periodictask
98	Can change periodic task	25	change_periodictask
99	Can delete periodic task	25	delete_periodictask
100	Can view periodic task	25	view_periodictask
101	Can add periodic task track	26	add_periodictasks
102	Can change periodic task track	26	change_periodictasks
103	Can delete periodic task track	26	delete_periodictasks
104	Can view periodic task track	26	view_periodictasks
105	Can add solar event	27	add_solarschedule
106	Can change solar event	27	change_solarschedule
107	Can delete solar event	27	delete_solarschedule
108	Can view solar event	27	view_solarschedule
109	Can add clocked	28	add_clockedschedule
110	Can change clocked	28	change_clockedschedule
111	Can delete clocked	28	delete_clockedschedule
112	Can view clocked	28	view_clockedschedule
113	Can add blacklisted token	29	add_blacklistedtoken
114	Can change blacklisted token	29	change_blacklistedtoken
115	Can delete blacklisted token	29	delete_blacklistedtoken
116	Can view blacklisted token	29	view_blacklistedtoken
117	Can add outstanding token	30	add_outstandingtoken
118	Can change outstanding token	30	change_outstandingtoken
119	Can delete outstanding token	30	delete_outstandingtoken
120	Can view outstanding token	30	view_outstandingtoken
121	Can add Recycle Bin Item	31	add_recyclebinitem
122	Can change Recycle Bin Item	31	change_recyclebinitem
123	Can delete Recycle Bin Item	31	delete_recyclebinitem
124	Can view Recycle Bin Item	31	view_recyclebinitem
\.


--
-- Data for Name: authtoken_token; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.authtoken_token (key, created, user_id) FROM stdin;
\.


--
-- Data for Name: core_recyclebinitem; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.core_recyclebinitem (id, object_id_int, object_id_uuid, original_data, deleted_at, expires_at, restored_at, content_type_id, deleted_by_id, restored_by_id) FROM stdin;
1	\N	e45d7eaa-d420-4cb0-b450-7784f2e717b0	{"id": "e45d7eaa-d420-4cb0-b450-7784f2e717b0", "notes": "This grant is being created with pending status to test automatic task creation.", "status": "expired", "program": null, "location": "New York, USA", "award_date": "2025-07-30", "contact_tel": "123-456-7890", "amount_value": "20000.00", "date_created": "2025-05-29T19:50:32.211204+00:00", "date_updated": "2025-05-30T08:38:14.854014+00:00", "submitted_by": "1c033260-5be8-4a59-a8f3-990073f89307", "contact_email": "contact@testgrantorg.com", "amount_currency": "USD", "application_link": "http://example.com/grant-application", "organization_name": "Mastercard fundation", "organization_type": "normal", "application_deadline": "2025-05-31"}	2025-06-03 22:06:59.080046+03	2025-08-12 22:06:59.080095+03	\N	16	1c033260-5be8-4a59-a8f3-990073f89307	\N
2	\N	f2db8583-fee5-4955-a09a-f37560d966c7	{"id": "f2db8583-fee5-4955-a09a-f37560d966c7", "notes": "This grant is being created with pending status to test automatic task creation.", "status": "expired", "program": null, "location": "New York, USA", "award_date": "2025-07-30", "contact_tel": "123-456-7890", "amount_value": "20000.00", "date_created": "2025-05-30T08:42:11.801862+00:00", "date_updated": "2025-05-30T13:10:15.678926+00:00", "submitted_by": "1c033260-5be8-4a59-a8f3-990073f89307", "contact_email": "contact@testgrantorg.com", "amount_currency": "USD", "application_link": "http://example.com/grant-application", "organization_name": "Mastercard fundation", "organization_type": "normal", "application_deadline": "2025-05-31"}	2025-06-03 22:11:07.353895+03	2025-08-12 22:11:07.353939+03	\N	16	1c033260-5be8-4a59-a8f3-990073f89307	\N
3	\N	4116c691-3a31-4037-bf6d-3c8ee62eef8a	{"id": "4116c691-3a31-4037-bf6d-3c8ee62eef8a", "notes": "hhhhhh", "status": "denied", "program": null, "location": "Kenya - Nairobi", "award_date": "2025-06-07", "contact_tel": "+254722222222", "amount_value": "1000000.00", "date_created": "2025-05-31T13:47:05.637438+00:00", "date_updated": "2025-06-03T06:37:34.063617+00:00", "submitted_by": "1c033260-5be8-4a59-a8f3-990073f89307", "contact_email": "contact@testgrantorg.com", "amount_currency": "KES", "application_link": "http://example.com/grant-application", "organization_name": "Safaricom Fundation", "organization_type": "grant_awarder", "application_deadline": "2025-06-06"}	2025-06-03 22:16:10.65969+03	2025-08-12 22:16:10.65973+03	\N	16	1c033260-5be8-4a59-a8f3-990073f89307	\N
5	\N	916cc619-03b3-4e02-95b0-f357671b1c09	{"id": "916cc619-03b3-4e02-95b0-f357671b1c09", "notes": "This grant is being created with pending status to test automatic task creation.", "status": "applied", "program": null, "location": "New York, USA", "award_date": "2025-07-30", "contact_tel": "123-456-7890", "amount_value": "20000.00", "date_created": "2025-05-30T08:42:03.446757+00:00", "date_updated": "2025-05-30T08:42:03.446777+00:00", "submitted_by": "1c033260-5be8-4a59-a8f3-990073f89307", "contact_email": "contact@testgrantorg.com", "amount_currency": "USD", "application_link": "http://example.com/grant-application", "organization_name": "Mastercard fundation", "organization_type": "normal", "application_deadline": "2025-05-31"}	2025-06-03 22:18:12.670682+03	2025-08-12 22:18:12.670714+03	2025-06-03 22:18:26.547687+03	16	1c033260-5be8-4a59-a8f3-990073f89307	\N
6	\N	916cc619-03b3-4e02-95b0-f357671b1c09	{"id": "916cc619-03b3-4e02-95b0-f357671b1c09", "notes": "This grant is being created with pending status to test automatic task creation.", "status": "applied", "program": null, "location": "New York, USA", "award_date": "2025-07-30", "contact_tel": "123-456-7890", "amount_value": "20000.00", "date_created": "2025-05-30T08:42:03.446757+00:00", "date_updated": "2025-05-30T08:42:03.446777+00:00", "submitted_by": "1c033260-5be8-4a59-a8f3-990073f89307", "contact_email": "contact@testgrantorg.com", "amount_currency": "USD", "application_link": "http://example.com/grant-application", "organization_name": "Mastercard fundation", "organization_type": "normal", "application_deadline": "2025-05-31"}	2025-06-03 22:18:46.901257+03	2025-08-12 22:18:46.901281+03	\N	16	1c033260-5be8-4a59-a8f3-990073f89307	\N
20	\N	9e77b25f-8835-41d2-8dab-9ef1fc27c5e9	{"id": "9e77b25f-8835-41d2-8dab-9ef1fc27c5e9", "gender": null, "program": "d56d17cb-00bb-482b-b429-ac967297996c", "location": "Nairobi", "is_active": true, "telephone": "07123456789", "created_at": "2025-06-04T14:26:38.468184+00:00", "created_by": "1c033260-5be8-4a59-a8f3-990073f89307", "start_date": "2025-06-01", "updated_at": "2025-06-04T15:03:58.982578+00:00", "updated_by": "1c033260-5be8-4a59-a8f3-990073f89307", "chama_group": "Upendo  Ventres", "person_name": "Rosy Marry Njeri"}	2025-06-04 18:15:30.706003+03	2025-08-13 18:15:30.706494+03	2025-06-04 18:16:17.47107+03	9	1c033260-5be8-4a59-a8f3-990073f89307	\N
21	\N	9e77b25f-8835-41d2-8dab-9ef1fc27c5e9	{"id": "9e77b25f-8835-41d2-8dab-9ef1fc27c5e9", "gender": null, "program": "d56d17cb-00bb-482b-b429-ac967297996c", "location": "Nairobi", "is_active": true, "telephone": "07123456789", "created_at": "2025-06-04T14:26:38.468184+00:00", "created_by": "1c033260-5be8-4a59-a8f3-990073f89307", "start_date": "2025-06-01", "updated_at": "2025-06-04T15:16:41.592471+00:00", "updated_by": "1c033260-5be8-4a59-a8f3-990073f89307", "chama_group": "Upendo  Group Chama Association", "person_name": "Rosy Marry Njeri"}	2025-06-04 18:18:17.12944+03	2025-08-13 18:18:17.12954+03	\N	9	1c033260-5be8-4a59-a8f3-990073f89307	\N
22	\N	d92f2db5-da0a-4ef8-bd0f-4912745564f6	{"id": "d92f2db5-da0a-4ef8-bd0f-4912745564f6", "gender": "male", "program": "5f15876d-a9e6-4cf3-8a92-3dbf640434de", "created_at": "2025-06-04T16:09:10.184351+00:00", "created_by": "1c033260-5be8-4a59-a8f3-990073f89307", "updated_at": "2025-06-04T16:09:10.184383+00:00", "updated_by": "1c033260-5be8-4a59-a8f3-990073f89307", "trainer_name": "Samuel Okoth", "trainer_email": "samuel.okoth@example.com", "trainer_phone": "0712345601", "trainer_association": "Master Welders Association"}	2025-06-05 21:12:49.98017+03	2025-08-14 21:12:49.9809+03	\N	12	1c033260-5be8-4a59-a8f3-990073f89307	\N
23	\N	1e4c4243-fb4b-4cdf-a8f6-298e875c74b1	{"id": "1e4c4243-fb4b-4cdf-a8f6-298e875c74b1", "notes": "This grant is being created with pending status to test automatic task creation.", "status": "expired", "program": null, "location": "New York, USA", "award_date": "2025-07-30", "contact_tel": "123-456-7890", "amount_value": "20000.00", "date_created": "2025-05-30T08:42:07.229894+00:00", "date_updated": "2025-06-03T15:25:23.169979+00:00", "submitted_by": "1c033260-5be8-4a59-a8f3-990073f89307", "contact_email": "contact@testgrantorg.com", "amount_currency": "USD", "application_link": "http://example.com/grant-application", "organization_name": "Mastercard fundation", "organization_type": "normal", "application_deadline": "2025-05-31"}	2025-06-05 22:30:45.096102+03	2025-08-14 22:30:45.0962+03	\N	16	1c033260-5be8-4a59-a8f3-990073f89307	\N
24	11	\N	{"id": 11, "name": "2025 Yearly Budget Maisha", "division": "overall", "description": "", "date_uploaded": "2025-06-06T07:06:06.111430+00:00", "document_link": "https://example.com/docs/nisira_budget_2025.pdf", "document_type": "yearly_budget_maisha", "document_format": "canva"}	2025-06-06 13:35:11.701696+03	2025-08-15 13:35:11.701781+03	2025-06-07 13:09:15.056913+03	14	bc1a3b21-3f45-4165-82cc-308b1f97ae91	1c033260-5be8-4a59-a8f3-990073f89307
25	\N	7abec591-a096-4ca8-864e-5597ce571556	{"id": "7abec591-a096-4ca8-864e-5597ce571556", "gender": null, "program": "012b3d48-ba93-4b4b-8019-2289b816f8e3", "end_date": "2025-07-08", "created_at": "2025-06-04T14:16:59.233255+00:00", "created_by": "1c033260-5be8-4a59-a8f3-990073f89307", "start_date": "2025-06-02", "updated_at": "2025-06-04T14:16:59.233293+00:00", "updated_by": "1c033260-5be8-4a59-a8f3-990073f89307", "student_name": "Alice Kwanza", "education_level": "Masters", "student_contact": "0711223344", "student_location": "Nairobi West", "school_associated": "Strathmore University"}	2025-06-07 13:28:34.970207+03	2025-08-16 13:28:34.970287+03	\N	10	1c033260-5be8-4a59-a8f3-990073f89307	\N
\.


--
-- Data for Name: divisions_division; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.divisions_division (name, id, description, date_created, date_updated, deleted_at, is_deleted) FROM stdin;
maisha	ceab7a40-831c-4729-8c22-d249ad70f3a7	maisha under compass.Inc	2025-05-26 17:02:28.839256+03	2025-05-26 17:02:28.839329+03	\N	f
nisria	5d80c663-1a73-49e0-9e95-dec9e55f507d	Nisria.Inc Division.	2025-05-26 17:02:10.627291+03	2025-06-03 09:52:20.020369+03	\N	f
\.


--
-- Data for Name: divisions_division_leads; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.divisions_division_leads (id, division_id, user_id) FROM stdin;
1	5d80c663-1a73-49e0-9e95-dec9e55f507d	22ebe5a7-ef0f-4829-9fac-9f5e04d0f6fb
2	ceab7a40-831c-4729-8c22-d249ad70f3a7	22ebe5a7-ef0f-4829-9fac-9f5e04d0f6fb
\.


--
-- Data for Name: divisions_educationprogramdetail; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.divisions_educationprogramdetail (created_at, updated_at, id, student_name, gender, education_level, student_location, student_contact, start_date, end_date, school_associated, created_by_id, updated_by_id, program_id, deleted_at, is_deleted) FROM stdin;
2025-06-04 17:16:59.233255+03	2025-06-04 17:16:59.233293+03	7abec591-a096-4ca8-864e-5597ce571556	Alice Kwanza	\N	Masters	Nairobi West	0711223344	2025-06-02	2025-07-08	Strathmore University	1c033260-5be8-4a59-a8f3-990073f89307	1c033260-5be8-4a59-a8f3-990073f89307	012b3d48-ba93-4b4b-8019-2289b816f8e3	2025-06-07 13:28:34.976914+03	t
\.


--
-- Data for Name: divisions_microfundprogramdetail; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.divisions_microfundprogramdetail (created_at, updated_at, id, person_name, gender, chama_group, is_active, start_date, location, telephone, created_by_id, updated_by_id, program_id, deleted_at, is_deleted) FROM stdin;
2025-06-04 17:26:38.468184+03	2025-06-04 18:16:41.592471+03	9e77b25f-8835-41d2-8dab-9ef1fc27c5e9	Rosy Marry Njeri	\N	Upendo  Group Chama Association	t	2025-06-01	Nairobi	07123456789	1c033260-5be8-4a59-a8f3-990073f89307	1c033260-5be8-4a59-a8f3-990073f89307	d56d17cb-00bb-482b-b429-ac967297996c	2025-06-04 18:18:17.13984+03	t
\.


--
-- Data for Name: divisions_program; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.divisions_program (name, id, description, monthly_budget, annual_budget, date_created, date_updated, division_id, deleted_at, is_deleted) FROM stdin;
rescue	6ac52781-e7f2-4aca-a844-18cf65362665	Provides support for rescued children.	30000.00	360000.00	2025-05-26 17:08:38.855081+03	2025-05-26 17:08:38.855141+03	5d80c663-1a73-49e0-9e95-dec9e55f507d	\N	f
vocational	5f15876d-a9e6-4cf3-8a92-3dbf640434de	Provides support for training youth.	30000.00	360000.00	2025-05-26 17:09:37.994858+03	2025-05-26 17:09:37.99501+03	ceab7a40-831c-4729-8c22-d249ad70f3a7	\N	f
education	012b3d48-ba93-4b4b-8019-2289b816f8e3	Provides educational support and scholarships.	5200.00	62400.00	2025-05-26 17:06:49.884585+03	2025-06-03 09:55:05.266856+03	5d80c663-1a73-49e0-9e95-dec9e55f507d	\N	f
microfund	d56d17cb-00bb-482b-b429-ac967297996c	Provides support for chama groups.	30000.00	360000.00	2025-05-26 17:07:49.079249+03	2025-06-04 17:06:16.208486+03	5d80c663-1a73-49e0-9e95-dec9e55f507d	\N	f
\.


--
-- Data for Name: divisions_program_maintainers; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.divisions_program_maintainers (id, program_id, user_id) FROM stdin;
1	012b3d48-ba93-4b4b-8019-2289b816f8e3	22ebe5a7-ef0f-4829-9fac-9f5e04d0f6fb
2	d56d17cb-00bb-482b-b429-ac967297996c	22ebe5a7-ef0f-4829-9fac-9f5e04d0f6fb
3	6ac52781-e7f2-4aca-a844-18cf65362665	22ebe5a7-ef0f-4829-9fac-9f5e04d0f6fb
4	5f15876d-a9e6-4cf3-8a92-3dbf640434de	22ebe5a7-ef0f-4829-9fac-9f5e04d0f6fb
\.


--
-- Data for Name: divisions_rescueprogramdetail; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.divisions_rescueprogramdetail (created_at, updated_at, id, child_name, gender, is_reunited, under_care, date_joined, date_reunited, age, place_found, rescuer_contact, notes, created_by_id, program_id, updated_by_id, deleted_at, is_deleted) FROM stdin;
2025-06-04 17:22:32.946757+03	2025-06-05 20:55:34.213457+03	cac24713-9b6a-4b33-b349-f3f0489da016	Baby lily	female	f	t	2025-06-05	\N	3	Stadium	0712345678	\N	1c033260-5be8-4a59-a8f3-990073f89307	6ac52781-e7f2-4aca-a844-18cf65362665	1c033260-5be8-4a59-a8f3-990073f89307	\N	f
\.


--
-- Data for Name: divisions_vocationaltrainingprogramtraineedetail; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.divisions_vocationaltrainingprogramtraineedetail (created_at, updated_at, id, trainee_name, gender, trainee_phone, trainee_email, trainee_association, date_enrolled, under_training, created_by_id, updated_by_id, trainer_id, deleted_at, is_deleted) FROM stdin;
\.


--
-- Data for Name: divisions_vocationaltrainingprogramtrainerdetail; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.divisions_vocationaltrainingprogramtrainerdetail (created_at, updated_at, id, trainer_name, gender, trainer_association, trainer_phone, trainer_email, created_by_id, program_id, updated_by_id, deleted_at, is_deleted) FROM stdin;
2025-06-04 19:09:10.184351+03	2025-06-04 19:09:10.184383+03	d92f2db5-da0a-4ef8-bd0f-4912745564f6	Samuel Okoth	male	Master Welders Association	0712345601	samuel.okoth@example.com	1c033260-5be8-4a59-a8f3-990073f89307	5f15876d-a9e6-4cf3-8a92-3dbf640434de	1c033260-5be8-4a59-a8f3-990073f89307	2025-06-05 21:12:49.994762+03	t
2025-06-05 21:13:26.877447+03	2025-06-05 21:50:03.075626+03	81c1d094-745c-4299-b137-1fdd0d917e7d	Sam Doe	male	Maisha School	07123456789	trainer@maisha.org	1c033260-5be8-4a59-a8f3-990073f89307	5f15876d-a9e6-4cf3-8a92-3dbf640434de	1c033260-5be8-4a59-a8f3-990073f89307	\N	f
\.


--
-- Data for Name: django_admin_log; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.django_admin_log (id, action_time, object_id, object_repr, action_flag, change_message, content_type_id, user_id) FROM stdin;
1	2025-05-26 17:22:57.181106+03	2	Nisira bank statement 2020 (Bank Statement)	3		14	1c033260-5be8-4a59-a8f3-990073f89307
\.


--
-- Data for Name: django_celery_beat_clockedschedule; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.django_celery_beat_clockedschedule (id, clocked_time) FROM stdin;
\.


--
-- Data for Name: django_celery_beat_crontabschedule; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.django_celery_beat_crontabschedule (id, minute, hour, day_of_week, day_of_month, month_of_year, timezone) FROM stdin;
1	0	4	*	*	*	Africa/Nairobi
2	35	0	*	*	*	Africa/Nairobi
3	17	15	*	*	*	Africa/Nairobi
4	0	0	*	*	*	Africa/Nairobi
\.


--
-- Data for Name: django_celery_beat_intervalschedule; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.django_celery_beat_intervalschedule (id, every, period) FROM stdin;
\.


--
-- Data for Name: django_celery_beat_periodictask; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.django_celery_beat_periodictask (id, name, task, args, kwargs, queue, exchange, routing_key, expires, enabled, last_run_at, total_run_count, date_changed, description, crontab_id, interval_id, solar_id, one_off, start_time, priority, headers, clocked_id, expire_seconds) FROM stdin;
2	expire_pending_grants_daily	grants.tasks.run_expire_pending_grants_command	[]	{}	\N	\N	\N	\N	t	2025-06-07 11:57:47.804219+03	6	2025-06-07 11:57:47.837083+03		2	\N	\N	f	\N	\N	{}	\N	\N
4	cleanup-expired-bin-items-daily	core.tasks.cleanup_expired_recycle_bin_items	[]	{}	\N	\N	\N	\N	t	2025-06-07 11:57:47.844865+03	4	2025-06-07 12:00:48.198026+03		4	\N	\N	f	\N	\N	{}	\N	\N
3	check_grant_deadlines_daily	notifications.tasks.check_grant_deadlines_and_notify_task	[]	{}	\N	\N	\N	\N	t	2025-06-07 15:17:00.008975+03	10	2025-06-07 15:19:00.448995+03		3	\N	\N	f	\N	\N	{}	\N	\N
1	celery.backend_cleanup	celery.backend_cleanup	[]	{}	\N	\N	\N	\N	t	\N	0	2025-06-07 11:57:47.715798+03		1	\N	\N	f	\N	\N	{}	\N	43200
\.


--
-- Data for Name: django_celery_beat_periodictasks; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.django_celery_beat_periodictasks (ident, last_update) FROM stdin;
1	2025-06-07 11:57:47.763714+03
\.


--
-- Data for Name: django_celery_beat_solarschedule; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.django_celery_beat_solarschedule (id, event, latitude, longitude) FROM stdin;
\.


--
-- Data for Name: django_content_type; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.django_content_type (id, app_label, model) FROM stdin;
1	admin	logentry
2	auth	permission
3	auth	group
4	contenttypes	contenttype
5	sessions	session
6	accounts	user
7	divisions	division
8	divisions	program
9	divisions	microfundprogramdetail
10	divisions	educationprogramdetail
11	divisions	rescueprogramdetail
12	divisions	vocationaltrainingprogramtrainerdetail
13	divisions	vocationaltrainingprogramtraineedetail
14	documents	document
15	documents	bankstatementaccessrequest
16	grants	grant
17	grants	grantexpenditure
18	email_templates	emailtemplates
19	notifications	notification
20	task_manager	task
21	authtoken	token
22	authtoken	tokenproxy
23	django_celery_beat	crontabschedule
24	django_celery_beat	intervalschedule
25	django_celery_beat	periodictask
26	django_celery_beat	periodictasks
27	django_celery_beat	solarschedule
28	django_celery_beat	clockedschedule
29	token_blacklist	blacklistedtoken
30	token_blacklist	outstandingtoken
31	core	recyclebinitem
\.


--
-- Data for Name: django_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.django_migrations (id, app, name, applied) FROM stdin;
1	contenttypes	0001_initial	2025-05-23 17:41:48.930566+03
2	contenttypes	0002_remove_content_type_name	2025-05-23 17:41:49.014344+03
3	auth	0001_initial	2025-05-23 17:41:49.229157+03
4	auth	0002_alter_permission_name_max_length	2025-05-23 17:41:49.30891+03
5	auth	0003_alter_user_email_max_length	2025-05-23 17:41:49.410271+03
6	auth	0004_alter_user_username_opts	2025-05-23 17:41:49.496831+03
7	auth	0005_alter_user_last_login_null	2025-05-23 17:41:49.593687+03
8	auth	0006_require_contenttypes_0002	2025-05-23 17:41:49.605755+03
9	auth	0007_alter_validators_add_error_messages	2025-05-23 17:41:49.738957+03
10	auth	0008_alter_user_username_max_length	2025-05-23 17:41:49.924502+03
11	auth	0009_alter_user_last_name_max_length	2025-05-23 17:41:49.985152+03
12	auth	0010_alter_group_name_max_length	2025-05-23 17:41:50.028721+03
13	auth	0011_update_proxy_permissions	2025-05-23 17:41:50.139002+03
14	auth	0012_alter_user_first_name_max_length	2025-05-23 17:41:50.215865+03
15	accounts	0001_initial	2025-05-23 17:41:50.422081+03
16	admin	0001_initial	2025-05-23 17:41:50.552132+03
17	admin	0002_logentry_remove_auto_add	2025-05-23 17:41:50.706385+03
18	admin	0003_logentry_add_action_flag_choices	2025-05-23 17:41:50.834608+03
19	authtoken	0001_initial	2025-05-23 17:41:50.941864+03
20	authtoken	0002_auto_20160226_1747	2025-05-23 17:41:51.369268+03
21	authtoken	0003_tokenproxy	2025-05-23 17:41:51.380472+03
22	authtoken	0004_alter_tokenproxy_options	2025-05-23 17:41:51.47212+03
23	divisions	0001_initial	2025-05-23 17:41:52.718284+03
24	django_celery_beat	0001_initial	2025-05-23 17:41:52.84437+03
25	django_celery_beat	0002_auto_20161118_0346	2025-05-23 17:41:52.998678+03
26	django_celery_beat	0003_auto_20161209_0049	2025-05-23 17:41:53.134874+03
27	django_celery_beat	0004_auto_20170221_0000	2025-05-23 17:41:53.186451+03
28	django_celery_beat	0005_add_solarschedule_events_choices	2025-05-23 17:41:53.237365+03
29	django_celery_beat	0006_auto_20180322_0932	2025-05-23 17:41:53.702198+03
30	django_celery_beat	0007_auto_20180521_0826	2025-05-23 17:41:53.855784+03
31	django_celery_beat	0008_auto_20180914_1922	2025-05-23 17:41:54.23316+03
32	django_celery_beat	0006_auto_20180210_1226	2025-05-23 17:41:54.506718+03
33	django_celery_beat	0006_periodictask_priority	2025-05-23 17:41:54.594412+03
34	django_celery_beat	0009_periodictask_headers	2025-05-23 17:41:54.670079+03
35	django_celery_beat	0010_auto_20190429_0326	2025-05-23 17:41:56.697562+03
36	django_celery_beat	0011_auto_20190508_0153	2025-05-23 17:41:56.869226+03
37	django_celery_beat	0012_periodictask_expire_seconds	2025-05-23 17:41:57.018722+03
38	django_celery_beat	0013_auto_20200609_0727	2025-05-23 17:41:57.154958+03
39	django_celery_beat	0014_remove_clockedschedule_enabled	2025-05-23 17:41:57.18923+03
40	django_celery_beat	0015_edit_solarschedule_events_choices	2025-05-23 17:41:57.250595+03
41	django_celery_beat	0016_alter_crontabschedule_timezone	2025-05-23 17:41:57.441+03
42	django_celery_beat	0017_alter_crontabschedule_month_of_year	2025-05-23 17:41:57.543372+03
43	django_celery_beat	0018_improve_crontab_helptext	2025-05-23 17:41:57.623156+03
44	django_celery_beat	0019_alter_periodictasks_options	2025-05-23 17:41:57.65193+03
45	documents	0001_initial	2025-05-23 17:41:57.689402+03
46	documents	0002_alter_document_document_type_and_more	2025-05-23 17:41:57.942153+03
47	email_templates	0001_initial	2025-05-23 17:41:58.121091+03
48	grants	0001_initial	2025-05-23 17:41:58.603503+03
49	notifications	0001_initial	2025-05-23 17:41:58.924488+03
50	sessions	0001_initial	2025-05-23 17:41:58.95563+03
51	task_manager	0001_initial	2025-05-23 17:41:59.16566+03
52	accounts	0002_alter_user_profile_picture	2025-05-26 16:13:42.937037+03
53	accounts	0003_alter_user_is_active_alter_user_is_staff	2025-05-26 16:13:43.128793+03
54	documents	0003_alter_document_name	2025-05-26 17:24:53.58823+03
55	notifications	0002_notification_assigner	2025-05-26 17:48:25.503841+03
56	notifications	0003_alter_notification_notification_type	2025-05-27 12:41:19.107914+03
57	token_blacklist	0001_initial	2025-05-27 23:15:16.046447+03
58	token_blacklist	0002_outstandingtoken_jti_hex	2025-05-27 23:15:16.225366+03
59	token_blacklist	0003_auto_20171017_2007	2025-05-27 23:15:16.439046+03
60	token_blacklist	0004_auto_20171017_2013	2025-05-27 23:15:16.606436+03
61	token_blacklist	0005_remove_outstandingtoken_jti	2025-05-27 23:15:16.891722+03
62	token_blacklist	0006_auto_20171017_2113	2025-05-27 23:15:17.268852+03
63	token_blacklist	0007_auto_20171017_2214	2025-05-27 23:15:17.804729+03
64	token_blacklist	0008_migrate_to_bigautofield	2025-05-27 23:15:18.077834+03
65	token_blacklist	0010_fix_migrate_to_bigautofield	2025-05-27 23:15:18.29783+03
66	token_blacklist	0011_linearizes_history	2025-05-27 23:15:18.303394+03
67	token_blacklist	0012_alter_outstandingtoken_user	2025-05-27 23:15:18.476072+03
68	core	0001_initial	2025-06-03 15:47:00.764827+03
69	email_templates	0002_emailtemplates_deleted_at_emailtemplates_is_deleted	2025-06-03 15:47:00.866963+03
70	divisions	0002_division_deleted_at_division_is_deleted_and_more	2025-06-03 17:34:23.97928+03
71	documents	0004_document_deleted_at_document_is_deleted	2025-06-03 17:34:24.043578+03
72	grants	0002_grant_deleted_at_grant_is_deleted_and_more	2025-06-03 17:34:24.255416+03
\.


--
-- Data for Name: django_session; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.django_session (session_key, session_data, expire_date) FROM stdin;
qi5jgpkpobzhkortxg60apkrgngrw0bu	.eJxVjjsOwjAQBe_iGltr1vGHkp4zRLv2mgRQIuVTIe5OIqWA-s2M3lu1tC5du84ytX1RF2UzIJ496IYlakdN0hQr6pQAAtaYEII6_WpM-SnD7pYHDffR5HFYpp7Njphjnc1tLPK6HuxfoKO522wAb70ISaKMsQmcgoRSBc_FAbB3rjIHX0qWKuCiyzXb7VR0VNlGVJ8vctBA6g:1uJXp8:w_bG3NOfD5qHoR5Mbcy58EID4J0fMHBhCmIL808q4sw	2025-06-09 16:25:02.776309+03
0snvyvxvzvqsptni5ktv6bge1a8k1fqj	.eJxVjjsOwjAQBe_iGltr1vGHkp4zRLv2mgRQIuVTIe5OIqWA-s2M3lu1tC5du84ytX1RF2UzIJ496IYlakdN0hQr6pQAAtaYEII6_WpM-SnD7pYHDffR5HFYpp7Njphjnc1tLPK6HuxfoKO522wAb70ISaKMsQmcgoRSBc_FAbB3rjIHX0qWKuCiyzXb7VR0VNlGVJ8vctBA6g:1uLMYp:KMg-VLNMwFHgK-FmLY5-6nXx6Q266iGUpVOM6F5NNZw	2025-06-14 16:47:43.173839+03
\.


--
-- Data for Name: documents_bankstatementaccessrequest; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.documents_bankstatementaccessrequest (id, pin, created_at, is_granted, document_id, user_id) FROM stdin;
1	138b19a0-b106-4117-beca-667ea27c746a	2025-05-26 17:28:11.384228+03	t	1	1c033260-5be8-4a59-a8f3-990073f89307
2	8d47538d-8fe8-4737-a287-5f127323b619	2025-05-26 17:29:55.663266+03	t	1	1c033260-5be8-4a59-a8f3-990073f89307
4	e627e327-3b3f-4842-80cf-2b4e488d4a8e	2025-05-26 18:02:36.95119+03	f	1	22ebe5a7-ef0f-4829-9fac-9f5e04d0f6fb
5	b166b1af-dc77-4a89-b3d9-c4a85a090e08	2025-05-26 18:03:24.392272+03	f	1	1c033260-5be8-4a59-a8f3-990073f89307
3	490d5ccc-5968-4a2d-8390-21bf4583421f	2025-05-26 17:57:45.616232+03	t	1	22ebe5a7-ef0f-4829-9fac-9f5e04d0f6fb
6	a20679fb-c8e6-40a6-bf0e-6a648b11c623	2025-05-26 18:29:17.87455+03	t	1	1c033260-5be8-4a59-a8f3-990073f89307
7	2c66cc8d-59c3-4849-bbe0-c850f6849788	2025-05-27 10:13:21.207191+03	t	1	1c033260-5be8-4a59-a8f3-990073f89307
8	fc0f6e05-3571-473b-ad90-1208a527d359	2025-06-07 15:03:04.611955+03	f	1	1c033260-5be8-4a59-a8f3-990073f89307
9	d282582a-63d7-4f32-bbe5-2e99c59d4927	2025-06-07 15:10:21.35478+03	f	1	bc1a3b21-3f45-4165-82cc-308b1f97ae91
10	ba9dd5e0-1be6-4157-ba29-99fadbe36a4a	2025-06-07 15:10:22.943384+03	f	5	bc1a3b21-3f45-4165-82cc-308b1f97ae91
\.


--
-- Data for Name: documents_document; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.documents_document (id, name, description, document_type, document_format, document_link, division, date_uploaded, deleted_at, is_deleted) FROM stdin;
1	Nisira bank statement 2020	Full financial projection for the Nisira branch for the year 2025	bank_statement	pdf	https://example.com/docs/nisira_budget_2025.pdf	nisira	2025-05-26 17:14:46.821275+03	\N	f
4	CBO Cert 2020	co cerfifications for the year 2020	cbo_cert	pdf	https://example.com/docs/nisira_budget_2025.pdf	overall	2025-06-06 09:59:01.150609+03	\N	f
5	Bank Statement 2025		bank_statement	pdf	https://example.com/docs/nisira_budget_2025.pdf	overall	2025-06-06 10:02:31.656132+03	\N	f
6	NGO Certifications		ngo_cert	pdf	https://example.com/docs/nisira_budget_2025.pdf	overall	2025-06-06 10:03:10.468674+03	\N	f
7	impact report 2024		impact_report	canva	https://example.com/docs/nisira_budget_2025.pdf	overall	2025-06-06 10:03:45.045215+03	\N	f
8	pitch Deck for investors		pitch_deck	canva	https://example.com/docs/nisira_budget_2025.pdf	overall	2025-06-06 10:04:31.772886+03	\N	f
9	May 2025 Monthly Budget		monthly_budget_nisria	canva	https://example.com/docs/nisira_budget_2025.pdf	overall	2025-06-06 10:05:23.475612+03	\N	f
10	May 2025 Monthly Budget Maisha		monthly_budget_maisha	canva	https://example.com/docs/nisira_budget_2025.pdf	overall	2025-06-06 10:05:41.206911+03	\N	f
12	2025 Yearly Budget Nisria		yearly_budget_nisria	excel	https://example.com/docs/nisira_budget_2025.pdf	overall	2025-06-06 10:07:04.674149+03	\N	f
13	overall Budget 2024		overall_budget	pptx	https://example.com/docs/nisira_budget_2025.pdf	overall	2025-06-06 10:07:49.641378+03	\N	f
14	Pasha	doex for pasha	impact_report	pdf	https://chatgpt.com/	overall	2025-06-06 10:19:40.894018+03	\N	f
15	Pasha-social	pasha v2	impact_report	docx	https://chatgpt.com/	overall	2025-06-06 10:26:10.66382+03	\N	f
16	pasha-social-2		cbo_cert	canva	https://www.canva.com/design/DAGgg8958MY/CTJqh2DqwiMX2uZmeNW1-g/edit	overall	2025-06-06 11:27:46.268841+03	\N	f
11	2025 Yearly Budget Maisha		yearly_budget_maisha	canva	https://example.com/docs/nisira_budget_2025.pdf	overall	2025-06-06 10:06:06.11143+03	\N	f
\.


--
-- Data for Name: email_templates_emailtemplates; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.email_templates_emailtemplates (name, id, template_type, subject_template, body_template, date_created, last_updated, created_by_id, updated_by_id, deleted_at, is_deleted) FROM stdin;
apply for {{organization}} program	8f5a6189-a86a-4c37-81d0-273a37ab7c21	program_application	Hello {{ organization }}!	Dear {{ partner_name }},\n\n---\n\n### 🌱 Our Mission\n\nAt Nisria, we believe in empowering communities and transforming lives through data, compassion, and sustainable programs. Your commitment to our cause is invaluable, and we are thrilled to embark on this journey together.\n\n---\n\n### 📋 What This Partnership Means:\n\n- **Shared Goals**: We align on the values of empathy, transparency, and measurable impact.\n- **Resource Access**: You'll receive regular updates, toolkits, and capacity-building resources.\n- **Collaborative Reporting**: Our teams will co-develop project metrics and share insights for continuous learning.\n\n---\n\n### 🧭 Key Upcoming Dates:\n\n| Event | Date | Description |\n|------|------|-------------|\n| Orientation Webinar | August 15, 2025 | Meet the team and learn about our tools |\n| Kickoff Meeting | September 1, 2025 | Review of project goals and roles |\n| Quarterly Review | December 20, 2025 | Joint evaluation and planning session |\n\n---\n\n### 📬 Contact Points\n\nFor any queries or support, feel free to reach out to:\n\n- Partnership Liaison: **Joy Wanjiru** – joy@nisria.org  \n- Grants Coordinator: **Eric Kiprono** – eric@nisria.org  \n- Tech & Data Support: **support@nisria.org**\n\n---\n\n### 📚 Reflection\n\n_"He who is kind to the poor lends to the LORD, and he will reward him for what he has done."_  \n**— Proverbs 19:17**\n\n---\n\n### 🙏 Final Words\n\nThank you again for joining hands with us. Together, we will make meaningful and measurable changes in the lives of those we serve.\n\nWarm regards,  \n**The Nisria Team**\n\n---\n\n*This is an automated message. Please do not reply directly to this email.*	2025-05-26 17:34:19.73514+03	2025-05-26 17:34:19.735176+03	1c033260-5be8-4a59-a8f3-990073f89307	1c033260-5be8-4a59-a8f3-990073f89307	\N	f
\.


--
-- Data for Name: grants_grant; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.grants_grant (organization_name, id, application_link, amount_currency, amount_value, notes, status, contact_tel, contact_email, location, organization_type, application_deadline, award_date, date_created, date_updated, program_id, submitted_by_id, deleted_at, is_deleted) FROM stdin;
Mastercard fundation	916cc619-03b3-4e02-95b0-f357671b1c09	http://example.com/grant-application	USD	20000.00	This grant is being created with pending status to test automatic task creation.	applied	123-456-7890	contact@testgrantorg.com	New York, USA	normal	2025-05-31	2025-07-30	2025-05-30 11:42:03.446757+03	2025-05-30 11:42:03.446777+03	\N	1c033260-5be8-4a59-a8f3-990073f89307	2025-06-03 22:18:46.90676+03	t
Mastercard fundation	1e4c4243-fb4b-4cdf-a8f6-298e875c74b1	http://example.com/grant-application	USD	20000.00	This grant is being created with pending status to test automatic task creation.	expired	123-456-7890	contact@testgrantorg.com	New York, USA	normal	2025-05-31	2025-07-30	2025-05-30 11:42:07.229894+03	2025-06-03 18:25:23.169979+03	\N	1c033260-5be8-4a59-a8f3-990073f89307	2025-06-05 22:30:45.106151+03	t
Tony Blair Institutee	31532c0c-e972-44fc-a1ba-61d30b60dd0d	http://example.com/grant-application	USD	20000.00	This grant is being created with pending status to test automatic task creation.	expired	+254722222222	contact@testgrantorg.com	Kenya - Nairobi	normal	2025-05-31	2025-07-30	2025-05-29 22:51:07.155736+03	2025-06-06 01:42:42.69832+03	\N	1c033260-5be8-4a59-a8f3-990073f89307	\N	f
Mastercard fundation	bd54a97b-6809-43f3-8b12-d0a3f1fa1838	http://example.com/grant-application	USD	20000.00	This grant is being created with pending status to test automatic task creation.	applied	123-456-7890	contact@testgrantorg.com	New York, USA	normal	2025-05-31	2025-07-30	2025-05-30 11:42:04.668043+03	2025-05-30 11:42:04.668058+03	\N	1c033260-5be8-4a59-a8f3-990073f89307	\N	f
Mastercard fundation	2d4051df-2320-4ff3-b438-5b79b6d34ba9	http://example.com/grant-application	USD	20000.00	This grant is being created with pending status to test automatic task creation.	applied	123-456-7890	contact@testgrantorg.com	New York, USA	normal	2025-05-31	2025-07-30	2025-05-30 11:42:08.942435+03	2025-05-30 11:42:08.94245+03	\N	1c033260-5be8-4a59-a8f3-990073f89307	\N	f
Mastercard fundation	767e107b-44e4-4c90-9948-0d309baf4cba	http://example.com/grant-application	USD	20000.00	This grant is being created with pending status to test automatic task creation.	approved	123-456-7890	contact@testgrantorg.com	New York, USA	normal	2025-05-31	2025-07-30	2025-05-29 22:49:16.372095+03	2025-06-03 18:32:26.191603+03	\N	1c033260-5be8-4a59-a8f3-990073f89307	\N	f
Mastercard fundation	5b063c68-e0c0-42c8-8440-a67bb01c1f8d	http://example.com/grant-application	USD	20000.00	This grant is being created with pending status to test automatic task creation.	denied	123-456-7890	contact@testgrantorg.com	New York, USA	normal	2025-05-31	2025-07-30	2025-05-30 11:42:00.492042+03	2025-05-30 11:49:33.751626+03	\N	1c033260-5be8-4a59-a8f3-990073f89307	\N	f
Mastercard fundation	0309e70d-cd54-4ae5-8154-45fd12a4f260	http://example.com/grant-application	USD	20000.00	This grant is being created with pending status to test automatic task creation.	pending	123-456-7890	contact@testgrantorg.com	New York, USA	normal	2025-07-01	2025-08-30	2025-05-30 14:25:17.812626+03	2025-05-30 14:26:24.228918+03	\N	1c033260-5be8-4a59-a8f3-990073f89307	\N	f
Mastercard fundation	86dfdc9d-2635-4618-9f37-23cb1104c0ad	http://example.com/grant-application	GBP	20000.00	This grant is being created with pending status to test automatic task creation.	approved	+12345678907	contact@testgrantorg.com	United Arab Emirates - Nairobi	normal	2025-05-31	2025-07-30	2025-05-30 11:42:05.84557+03	2025-05-31 16:40:07.131625+03	\N	1c033260-5be8-4a59-a8f3-990073f89307	\N	f
Test Grant Org - Pending Task	e0ce4e4a-9098-488b-b40d-63266831e341	http://example.com/grant-application	USD	50000.00	This grant is being created with pending status to test automatic task creation.	expired	123-456-7890	contact@testgrantorg.com	New York, USA	normal	2024-05-27	\N	2025-05-26 17:35:42.454114+03	2025-05-26 17:35:42.454169+03	\N	1c033260-5be8-4a59-a8f3-990073f89307	\N	f
\.


--
-- Data for Name: grants_grant_required_documents; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.grants_grant_required_documents (id, grant_id, document_id) FROM stdin;
\.


--
-- Data for Name: grants_grant_submitted_documents; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.grants_grant_submitted_documents (id, grant_id, document_id) FROM stdin;
\.


--
-- Data for Name: grants_grantexpenditure; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.grants_grantexpenditure (id, amount_used, estimated_depletion_date, grant_id, deleted_at, is_deleted) FROM stdin;
dc2bbc60-2f16-46f7-9c1e-5060870bdb7e	0.00	\N	767e107b-44e4-4c90-9948-0d309baf4cba	\N	f
\.


--
-- Data for Name: notifications_notification; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.notifications_notification (id, message, notification_type, read_status, created_at, link, recipient_id, assigner_id) FROM stdin;
ff4b6be6-cf2c-44db-8547-5b56d5074297	You have been assigned a new task: 'Update bank statement' by None None.	task_assigned	f	2025-05-26 17:31:46.383584+03	/tasks/03e2459b-fd72-4fc2-8f41-5f23fce23022/	22ebe5a7-ef0f-4829-9fac-9f5e04d0f6fb	\N
bc59e490-df5b-4637-abe9-8aff9c4e383e	You have been assigned a new task: 'Update bank statement' by None None.	task_assigned	f	2025-05-26 17:43:23.55696+03	/tasks/9e0c3c7e-f15b-44c0-8501-2aa4390aa020/	22ebe5a7-ef0f-4829-9fac-9f5e04d0f6fb	\N
4251449c-581d-4846-a5b6-aebeefd4434e	You have been assigned a new task: 'Update bank statement' by None None.	task_assigned	f	2025-05-26 17:48:34.66663+03	/tasks/184310fe-354d-49cb-ae7f-b4b4fee6996b/	22ebe5a7-ef0f-4829-9fac-9f5e04d0f6fb	\N
d935784b-1e2e-4293-8d8e-7c610bdb9825	Reminder: Grant 'Mastercard fundation' deadline is in 1 day(s) on 2025-05-31.	grant_deadline_reminder	f	2025-05-30 15:17:00.130215+03	/grants/31532c0c-e972-44fc-a1ba-61d30b60dd0d/	bc1a3b21-3f45-4165-82cc-308b1f97ae91	\N
cd589a6e-3ad9-4312-aece-b53814e4e7f2	Reminder: Grant 'Mastercard fundation' deadline is in 1 day(s) on 2025-05-31.	grant_deadline_reminder	f	2025-05-30 15:17:00.140191+03	/grants/31532c0c-e972-44fc-a1ba-61d30b60dd0d/	22ebe5a7-ef0f-4829-9fac-9f5e04d0f6fb	\N
ae77811a-4197-4208-9dac-03e1ebd07199	Reminder: Grant 'Mastercard fundation' deadline is in 1 day(s) on 2025-05-31.	grant_deadline_reminder	f	2025-05-30 15:17:00.158084+03	/grants/31532c0c-e972-44fc-a1ba-61d30b60dd0d/	f0169040-145e-4abb-ad6c-986e9ed08e9e	\N
46fba04e-687f-477c-a3a2-a2f452c749a2	Reminder: Grant 'Mastercard fundation' deadline is in 1 day(s) on 2025-05-31.	grant_deadline_reminder	f	2025-05-30 15:17:00.183643+03	/grants/31532c0c-e972-44fc-a1ba-61d30b60dd0d/	b241024b-e362-4681-b9cf-c9b09ab498db	\N
519b7c0a-1d72-45b3-9a73-305e9c7c3a8d	Reminder: Grant 'Mastercard fundation' deadline is in 1 day(s) on 2025-05-31.	grant_deadline_reminder	f	2025-05-30 15:17:00.233181+03	/grants/1e4c4243-fb4b-4cdf-a8f6-298e875c74b1/	bc1a3b21-3f45-4165-82cc-308b1f97ae91	\N
2d47bb89-d33e-445f-8595-933693d4a540	Reminder: Grant 'Mastercard fundation' deadline is in 1 day(s) on 2025-05-31.	grant_deadline_reminder	f	2025-05-30 15:17:00.250154+03	/grants/1e4c4243-fb4b-4cdf-a8f6-298e875c74b1/	22ebe5a7-ef0f-4829-9fac-9f5e04d0f6fb	\N
049b5e30-58d4-4709-9edf-dcd41e9f6d1d	Reminder: Grant 'Mastercard fundation' deadline is in 1 day(s) on 2025-05-31.	grant_deadline_reminder	f	2025-05-30 15:17:00.265051+03	/grants/1e4c4243-fb4b-4cdf-a8f6-298e875c74b1/	f0169040-145e-4abb-ad6c-986e9ed08e9e	\N
f3e6c92b-26ae-4276-987f-1d5d95f498ef	Reminder: Grant 'Mastercard fundation' deadline is in 1 day(s) on 2025-05-31.	grant_deadline_reminder	f	2025-05-30 15:17:00.286377+03	/grants/1e4c4243-fb4b-4cdf-a8f6-298e875c74b1/	b241024b-e362-4681-b9cf-c9b09ab498db	\N
f5b0d4f6-5701-4086-8fd6-0e740371c496	Reminder: Grant 'Mastercard fundation' deadline is in 0 day(s) on 2025-05-31.	grant_deadline_reminder	f	2025-05-31 15:17:00.31556+03	/grants/31532c0c-e972-44fc-a1ba-61d30b60dd0d/	22ebe5a7-ef0f-4829-9fac-9f5e04d0f6fb	\N
e4180cba-e20e-4701-b71a-18636c36eeaa	Reminder: Grant 'Mastercard fundation' deadline is in 0 day(s) on 2025-05-31.	grant_deadline_reminder	f	2025-05-31 15:17:00.322785+03	/grants/31532c0c-e972-44fc-a1ba-61d30b60dd0d/	f0169040-145e-4abb-ad6c-986e9ed08e9e	\N
0d879143-a466-4b6e-ba30-06f3c98e56af	Reminder: Grant 'Mastercard fundation' deadline is in 0 day(s) on 2025-05-31.	grant_deadline_reminder	f	2025-05-31 15:17:00.33083+03	/grants/31532c0c-e972-44fc-a1ba-61d30b60dd0d/	b241024b-e362-4681-b9cf-c9b09ab498db	\N
935e1e6b-f6fd-4356-a73c-d2407c9308be	Reminder: Grant 'Mastercard fundation' deadline is in 0 day(s) on 2025-05-31.	grant_deadline_reminder	f	2025-05-31 15:17:00.355372+03	/grants/1e4c4243-fb4b-4cdf-a8f6-298e875c74b1/	22ebe5a7-ef0f-4829-9fac-9f5e04d0f6fb	\N
d7c5a280-9542-4e70-98ea-9e6a35bb789c	Reminder: Grant 'Mastercard fundation' deadline is in 0 day(s) on 2025-05-31.	grant_deadline_reminder	f	2025-05-31 15:17:00.367453+03	/grants/1e4c4243-fb4b-4cdf-a8f6-298e875c74b1/	f0169040-145e-4abb-ad6c-986e9ed08e9e	\N
ff2d1781-22a2-4326-ad68-8ba836bbd2ef	Reminder: Grant 'Mastercard fundation' deadline is in 0 day(s) on 2025-05-31.	grant_deadline_reminder	f	2025-05-31 15:17:00.375187+03	/grants/1e4c4243-fb4b-4cdf-a8f6-298e875c74b1/	b241024b-e362-4681-b9cf-c9b09ab498db	\N
0fbeddf2-ab3f-456a-8d67-51feea69f337	Reminder: Grant 'Mastercard fundation' deadline is in 0 day(s) on 2025-05-31.	grant_deadline_reminder	t	2025-05-31 15:17:00.347365+03	/grants/1e4c4243-fb4b-4cdf-a8f6-298e875c74b1/	bc1a3b21-3f45-4165-82cc-308b1f97ae91	\N
2ccd1076-242f-40c2-8b15-9ae8c02b71e7	Reminder: Grant 'Mastercard fundation' deadline is in 0 day(s) on 2025-05-31.	grant_deadline_reminder	t	2025-05-31 15:17:00.311239+03	/grants/31532c0c-e972-44fc-a1ba-61d30b60dd0d/	bc1a3b21-3f45-4165-82cc-308b1f97ae91	\N
4a0b22d6-3e12-43a3-86e8-0ad7cca36feb	You have been assigned a new task: 'Update Bank Statements'	task_assigned	f	2025-06-07 17:23:40.277529+03	/tasks/7e5b9640-3a7c-4a0c-a9e1-2a58cbd813d8/	f0169040-145e-4abb-ad6c-986e9ed08e9e	1c033260-5be8-4a59-a8f3-990073f89307
\.


--
-- Data for Name: task_manager_task; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.task_manager_task (title, id, description, status, priority, due_date, created_at, updated_at, is_grant_follow_up_task, assigned_by_id, assigned_to_id, grant_id) FROM stdin;
Update bank statement	03e2459b-fd72-4fc2-8f41-5f23fce23022	update to the newest bank statement	todo	high	2024-12-31	2025-05-26 17:31:45.812878+03	2025-05-26 17:31:45.812934+03	f	1c033260-5be8-4a59-a8f3-990073f89307	22ebe5a7-ef0f-4829-9fac-9f5e04d0f6fb	\N
Update bank statement	9e0c3c7e-f15b-44c0-8501-2aa4390aa020	update to the newest bank statement	todo	high	2024-12-31	2025-05-26 17:43:23.134244+03	2025-05-26 17:43:23.134312+03	f	1c033260-5be8-4a59-a8f3-990073f89307	22ebe5a7-ef0f-4829-9fac-9f5e04d0f6fb	\N
Update bank statement	184310fe-354d-49cb-ae7f-b4b4fee6996b	update to the newest bank statement	todo	high	2024-12-31	2025-05-26 17:48:33.621744+03	2025-05-26 17:48:33.621821+03	f	1c033260-5be8-4a59-a8f3-990073f89307	22ebe5a7-ef0f-4829-9fac-9f5e04d0f6fb	\N
Update bank statement	0b095e5e-ca60-4c0a-9fd5-db939543048f	update to the newest bank statement	todo	high	2024-12-31	2025-05-27 23:20:56.062801+03	2025-05-27 23:20:56.062872+03	f	1c033260-5be8-4a59-a8f3-990073f89307	\N	\N
Follow up: Grant 'Mastercard fundation' is pending	baffe50d-d5f8-4cbd-be23-93436da6a860	The grant application for 'Mastercard fundation' (ID: 767e107b-44e4-4c90-9948-0d309baf4cba) has been marked as 'pending' on 2025-05-29 19:49. Please review and take necessary actions.\n\nThis task was automatically marked as completed on 2025-05-30 08:38 because the linked grant 'Mastercard fundation' (ID: 767e107b-44e4-4c90-9948-0d309baf4cba) status changed from 'pending' to 'Approved'.	completed	medium	2025-05-31	2025-05-29 22:49:16.408537+03	2025-05-30 11:38:12.768786+03	t	1c033260-5be8-4a59-a8f3-990073f89307	1c033260-5be8-4a59-a8f3-990073f89307	767e107b-44e4-4c90-9948-0d309baf4cba
Follow up: Grant 'Mastercard fundation' is pending	cb1c1830-98b6-4ec4-afa7-530f3f1a3584	The grant application for 'Mastercard fundation' (ID: 0309e70d-cd54-4ae5-8154-45fd12a4f260) has been marked as 'pending' on 2025-05-30 11:26. Please review and take necessary actions.	todo	medium	2025-07-01	2025-05-30 14:26:24.237706+03	2025-05-30 14:26:24.237732+03	t	1c033260-5be8-4a59-a8f3-990073f89307	1c033260-5be8-4a59-a8f3-990073f89307	0309e70d-cd54-4ae5-8154-45fd12a4f260
Follow up: Grant 'Test Grant Org - Pending Task' is pending	e860f91b-50b3-4e0f-82b6-eb07e1705651	The grant application for 'Test Grant Org - Pending Task' (ID: e0ce4e4a-9098-488b-b40d-63266831e341) has been marked as 'pending' on 2025-05-26 14:35. Please review and take necessary actions.\n\nThis task was automatically marked as completed on 2025-06-02 19:04 because the linked grant 'Test Grant Org - Pending Task' (ID: e0ce4e4a-9098-488b-b40d-63266831e341) status changed from 'pending' to 'Expired'.	completed	medium	2024-05-27	2025-05-26 17:35:42.467364+03	2025-06-02 22:04:19.694302+03	t	1c033260-5be8-4a59-a8f3-990073f89307	1c033260-5be8-4a59-a8f3-990073f89307	e0ce4e4a-9098-488b-b40d-63266831e341
Follow up: Grant 'Mastercard fundation' is pending	d68cfc42-9d1b-4abc-8224-9cd3e1a27fd7	The grant application for 'Mastercard fundation' (ID: 31532c0c-e972-44fc-a1ba-61d30b60dd0d) has been marked as 'pending' on 2025-05-30 08:38. Please review and take necessary actions.\n\nThis task was automatically marked as completed on 2025-06-02 19:04 because the linked grant 'Mastercard fundation' (ID: 31532c0c-e972-44fc-a1ba-61d30b60dd0d) status changed from 'pending' to 'Expired'.	completed	medium	2025-05-31	2025-05-30 11:38:22.727415+03	2025-06-02 22:04:19.704439+03	t	1c033260-5be8-4a59-a8f3-990073f89307	1c033260-5be8-4a59-a8f3-990073f89307	31532c0c-e972-44fc-a1ba-61d30b60dd0d
Follow up: Grant 'Mastercard fundation' is pending	fb2ee271-1348-4b85-b32c-f94f026175c4	The grant application for 'Mastercard fundation' (ID: 1e4c4243-fb4b-4cdf-a8f6-298e875c74b1) has been marked as 'pending' on 2025-05-30 08:49. Please review and take necessary actions.\n\nThis task was automatically marked as completed on 2025-06-02 19:04 because the linked grant 'Mastercard fundation' (ID: 1e4c4243-fb4b-4cdf-a8f6-298e875c74b1) status changed from 'pending' to 'Expired'.	completed	medium	2025-05-31	2025-05-30 11:49:00.054051+03	2025-06-02 22:04:19.710639+03	t	1c033260-5be8-4a59-a8f3-990073f89307	1c033260-5be8-4a59-a8f3-990073f89307	1e4c4243-fb4b-4cdf-a8f6-298e875c74b1
Follow up: Grant 'Safaricom Fundation' is pending	a551f659-d276-4511-8fd7-8b65ec3db05f	The grant application for 'Safaricom Fundation' (ID: 4116c691-3a31-4037-bf6d-3c8ee62eef8a) has been marked as 'pending' on 2025-05-31 13:47. Please review and take necessary actions.\n\nThis task was automatically marked as completed on 2025-05-31 13:48 because the linked grant 'Safaricom Fundation' (ID: 4116c691-3a31-4037-bf6d-3c8ee62eef8a) status changed from 'pending' to 'Approved'.	completed	medium	2025-06-06	2025-05-31 16:47:05.686203+03	2025-05-31 16:48:04.578757+03	t	1c033260-5be8-4a59-a8f3-990073f89307	1c033260-5be8-4a59-a8f3-990073f89307	\N
Follow up: Grant 'Safaricom Fundation' is pending	eca08955-ca09-4d39-b0f8-c342d0b50003	The grant application for 'Safaricom Fundation' (ID: 4116c691-3a31-4037-bf6d-3c8ee62eef8a) has been marked as 'pending' on 2025-05-31 14:19. Please review and take necessary actions.\n\nThis task was automatically marked as completed on 2025-05-31 14:19 because the linked grant 'Safaricom Fundation' (ID: 4116c691-3a31-4037-bf6d-3c8ee62eef8a) status changed from 'pending' to 'Approved'.	completed	medium	2025-06-06	2025-05-31 17:19:00.493554+03	2025-05-31 17:19:09.393531+03	t	1c033260-5be8-4a59-a8f3-990073f89307	1c033260-5be8-4a59-a8f3-990073f89307	\N
Update Bank Statements	7e5b9640-3a7c-4a0c-a9e1-2a58cbd813d8	Update the statements	todo	high	2025-06-14	2025-06-07 17:23:40.04878+03	2025-06-07 17:40:41.134162+03	f	1c033260-5be8-4a59-a8f3-990073f89307	f0169040-145e-4abb-ad6c-986e9ed08e9e	\N
\.


--
-- Data for Name: token_blacklist_blacklistedtoken; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.token_blacklist_blacklistedtoken (id, blacklisted_at, token_id) FROM stdin;
1	2025-05-27 23:19:49.592886+03	1
2	2025-05-27 23:27:56.188225+03	2
3	2025-05-28 01:15:27.504684+03	4
4	2025-05-28 01:21:33.929267+03	5
5	2025-05-28 01:30:55.725915+03	6
6	2025-05-28 01:32:08.031259+03	7
7	2025-05-28 01:33:03.092963+03	8
8	2025-05-28 09:57:55.373773+03	9
9	2025-05-28 09:58:32.943517+03	10
10	2025-05-28 12:16:09.562144+03	11
11	2025-05-28 14:01:45.363867+03	12
12	2025-05-28 14:10:19.580933+03	13
13	2025-05-28 15:48:27.446832+03	14
14	2025-05-29 13:57:27.265413+03	15
15	2025-05-29 17:11:55.131243+03	16
16	2025-05-29 21:51:25.397876+03	18
17	2025-05-31 11:14:38.318247+03	21
18	2025-05-31 11:21:50.800449+03	22
19	2025-05-31 11:33:37.20154+03	24
20	2025-05-31 12:56:33.599154+03	30
21	2025-06-01 17:51:17.888456+03	35
22	2025-06-01 18:15:56.353394+03	36
23	2025-06-03 09:37:59.811229+03	38
24	2025-06-06 01:47:21.713214+03	43
25	2025-06-06 13:47:43.056726+03	45
26	2025-06-06 13:52:48.958505+03	46
27	2025-06-07 15:09:49.557315+03	49
28	2025-06-07 15:10:29.215313+03	50
29	2025-06-07 16:21:52.548263+03	51
30	2025-06-07 16:30:10.050371+03	53
\.


--
-- Data for Name: token_blacklist_outstandingtoken; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.token_blacklist_outstandingtoken (id, token, created_at, expires_at, user_id, jti) FROM stdin;
1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0ODk4MTg2MiwiaWF0IjoxNzQ4Mzc3MDYyLCJqdGkiOiJlM2JiZmM4NmM3OTc0ZjJiYTQzZDdiZTY4NjFlYTA2NyIsInVzZXJfaWQiOiIxYzAzMzI2MC01YmU4LTRhNTktYThmMy05OTAwNzNmODkzMDcifQ.u9HvWx-9QSs69JVNBxcX4x3Bdxg6-3L2s-nJPk_n5kk	2025-05-27 23:17:42.686784+03	2025-06-03 23:17:42+03	1c033260-5be8-4a59-a8f3-990073f89307	e3bbfc86c7974f2ba43d7be6861ea067
2	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0ODk4MjQ1MCwiaWF0IjoxNzQ4Mzc3NjUwLCJqdGkiOiI1NjQyZWEyOGQzOWM0YzMzODRhOWRiZWEwYjI4MDU3ZCIsInVzZXJfaWQiOiIxYzAzMzI2MC01YmU4LTRhNTktYThmMy05OTAwNzNmODkzMDcifQ.L0OZ14CWDgIDF_zMj-QAX4bs7kAxajNK9ZEb5wbA7Yk	2025-05-27 23:27:30.416419+03	2025-06-03 23:27:30+03	1c033260-5be8-4a59-a8f3-990073f89307	5642ea28d39c4c3384a9dbea0b28057d
3	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0ODk4MzgzOCwiaWF0IjoxNzQ4Mzc5MDM4LCJqdGkiOiJhNTA2ZTFmMzk5MDA0NTcyYTVkMTA2MzhhZDhjOWU2ZSIsInVzZXJfaWQiOiIyMmViZTVhNy1lZjBmLTQ4MjktOWZhYy05ZjVlMDRkMGY2ZmIifQ.-KD38yDhkbm09DyziWprG380Hepcy019dr6EFUNX6Cc	2025-05-27 23:50:38.176437+03	2025-06-03 23:50:38+03	22ebe5a7-ef0f-4829-9fac-9f5e04d0f6fb	a506e1f399004572a5d10638ad8c9e6e
4	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0ODk4ODkwOSwiaWF0IjoxNzQ4Mzg0MTA5LCJqdGkiOiJiMTc3ZTIyMDViMTU0YWIyYTU4ZjRlZDFlYWIwZGZmYyIsInVzZXJfaWQiOiIxYzAzMzI2MC01YmU4LTRhNTktYThmMy05OTAwNzNmODkzMDcifQ.qxV-E1cKAHp-JuOqhbuElF5cYDU4uU_jA1Sq4mSAPJc	2025-05-28 01:15:09.775146+03	2025-06-04 01:15:09+03	1c033260-5be8-4a59-a8f3-990073f89307	b177e2205b154ab2a58f4ed1eab0dffc
5	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0ODk4OTE4NiwiaWF0IjoxNzQ4Mzg0Mzg2LCJqdGkiOiJlZGVhMWQ0MzM5OWQ0ZmVmYmY1ODViODE3OTFkMmZjZCIsInVzZXJfaWQiOiIxYzAzMzI2MC01YmU4LTRhNTktYThmMy05OTAwNzNmODkzMDcifQ.rB2lyGk70wrwT9DeK0XImwVYx33DaJ-lAG91e32gvfA	2025-05-28 01:19:46.831491+03	2025-06-04 01:19:46+03	1c033260-5be8-4a59-a8f3-990073f89307	edea1d43399d4fefbf585b81791d2fcd
6	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0ODk4OTYxNywiaWF0IjoxNzQ4Mzg0ODE3LCJqdGkiOiIzYzQxYjE2OTI5Yzg0ZGMyYjA1YmJhYzU4YjE1ODNkMyIsInVzZXJfaWQiOiIxYzAzMzI2MC01YmU4LTRhNTktYThmMy05OTAwNzNmODkzMDcifQ.CJKdY9SB672MJYiQqSPWSXiUubIYAiTEZv8GLJrKnA4	2025-05-28 01:26:57.480364+03	2025-06-04 01:26:57+03	1c033260-5be8-4a59-a8f3-990073f89307	3c41b16929c84dc2b05bbac58b1583d3
7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0ODk4OTg4NCwiaWF0IjoxNzQ4Mzg1MDg0LCJqdGkiOiI5MTU1MDg2YzllZjg0Y2NjYWZlN2IzYTI2MmU1YmI5NiIsInVzZXJfaWQiOiIyMmViZTVhNy1lZjBmLTQ4MjktOWZhYy05ZjVlMDRkMGY2ZmIifQ.PMrHSloGM4mnXQy-qVSCLeIEoy-86K5KM2yBpt1PZUQ	2025-05-28 01:31:24.207965+03	2025-06-04 01:31:24+03	22ebe5a7-ef0f-4829-9fac-9f5e04d0f6fb	9155086c9ef84cccafe7b3a262e5bb96
8	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0ODk4OTk2MSwiaWF0IjoxNzQ4Mzg1MTYxLCJqdGkiOiI3MGUyYWMwOTE0NGM0ZjY4ODg2MTczMjlhNDQyMjYxYyIsInVzZXJfaWQiOiJiYzFhM2IyMS0zZjQ1LTQxNjUtODJjYy0zMDhiMWY5N2FlOTEifQ.KmvpdxRvjgahOQpR2QreyKyPyI5SjFFOdTM8qhYPThI	2025-05-28 01:32:41.569745+03	2025-06-04 01:32:41+03	bc1a3b21-3f45-4165-82cc-308b1f97ae91	70e2ac09144c4f6888617329a442261c
9	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0OTAyMDIyOSwiaWF0IjoxNzQ4NDE1NDI5LCJqdGkiOiI2ZDhjMTc4ZTFjYmU0NmZmODIxNDIyNWNhZDhhOTI4ZiIsInVzZXJfaWQiOiIxYzAzMzI2MC01YmU4LTRhNTktYThmMy05OTAwNzNmODkzMDcifQ.yDF4kvScVtgtkflw-IQj2RNVhby501G13nH0vdloxho	2025-05-28 09:57:09.153386+03	2025-06-04 09:57:09+03	1c033260-5be8-4a59-a8f3-990073f89307	6d8c178e1cbe46ff8214225cad8a928f
10	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0OTAyMDI4OSwiaWF0IjoxNzQ4NDE1NDg5LCJqdGkiOiJiYmYzN2U0NGQyMjM0NWM3YjZkZjE3Yzk2N2Q2Mjg1MiIsInVzZXJfaWQiOiIyMmViZTVhNy1lZjBmLTQ4MjktOWZhYy05ZjVlMDRkMGY2ZmIifQ.G7ZNywC0zFG1Up9n69Om30DcOhsS0AM607ZYhdOYidU	2025-05-28 09:58:09.016622+03	2025-06-04 09:58:09+03	22ebe5a7-ef0f-4829-9fac-9f5e04d0f6fb	bbf37e44d22345c7b6df17c967d62852
11	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0OTAyNjc1OSwiaWF0IjoxNzQ4NDIxOTU5LCJqdGkiOiJlYjUwMDkyMzY5ZDk0ZGZlYTJhN2ZhYzdkZDAzMGQ2OSIsInVzZXJfaWQiOiIxYzAzMzI2MC01YmU4LTRhNTktYThmMy05OTAwNzNmODkzMDcifQ.lLVTTPb6032oOdoGdWx03y9pS3QXUfRKFwyFsP6GFHk	2025-05-28 11:45:59.468475+03	2025-06-04 11:45:59+03	1c033260-5be8-4a59-a8f3-990073f89307	eb50092369d94dfea2a7fac7dd030d69
12	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0OTAyODU5MiwiaWF0IjoxNzQ4NDIzNzkyLCJqdGkiOiIwNDY5M2ZhNjJjZjc0ZjM4OTY4NzhlYmIyNmEzNmQ4NiIsInVzZXJfaWQiOiIxYzAzMzI2MC01YmU4LTRhNTktYThmMy05OTAwNzNmODkzMDcifQ.D3eMdryW3gPux8pzc15kzX449WI5FdONgRnxPnlg1mA	2025-05-28 12:16:32.749829+03	2025-06-04 12:16:32+03	1c033260-5be8-4a59-a8f3-990073f89307	04693fa62cf74f3896878ebb26a36d86
13	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0OTAzNTEzMCwiaWF0IjoxNzQ4NDMwMzMwLCJqdGkiOiI0MTIwMmZjOWRkMmY0MTZhYjg5OGI0NmE2ZmI0MTlhZCIsInVzZXJfaWQiOiIxYzAzMzI2MC01YmU4LTRhNTktYThmMy05OTAwNzNmODkzMDcifQ.uzQbVBiUh_FwJHeSytW06yB_aka1_3t-XWF0aNY_YU0	2025-05-28 14:05:30.303337+03	2025-06-04 14:05:30+03	1c033260-5be8-4a59-a8f3-990073f89307	41202fc9dd2f416ab898b46a6fb419ad
14	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0OTA0MDc2MCwiaWF0IjoxNzQ4NDM1OTYwLCJqdGkiOiJiNDA4ZGE1Mzg0MjI0ZmRhYTdlNWNlMzU1MDgzYjNjZiIsInVzZXJfaWQiOiIxYzAzMzI2MC01YmU4LTRhNTktYThmMy05OTAwNzNmODkzMDcifQ.uhQ-qqOK3WZh5RJ53R2zyXVtPlCPSzm9CKSKRsD5SJw	2025-05-28 15:39:20.581013+03	2025-06-04 15:39:20+03	1c033260-5be8-4a59-a8f3-990073f89307	b408da5384224fdaa7e5ce355083b3cf
15	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0OTA0MTMyMSwiaWF0IjoxNzQ4NDM2NTIxLCJqdGkiOiI1YjliYzFjNDZjMzU0MTI1OTQxNDFmMTI5NmNmZDJlOSIsInVzZXJfaWQiOiIxYzAzMzI2MC01YmU4LTRhNTktYThmMy05OTAwNzNmODkzMDcifQ.BAgsOvwOim_8WLAWFzcRB1Us6WvJl2BgHcI-8AiHsvk	2025-05-28 15:48:41.744336+03	2025-06-04 15:48:41+03	1c033260-5be8-4a59-a8f3-990073f89307	5b9bc1c46c35412594141f1296cfd2e9
16	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0OTEyMTE0NiwiaWF0IjoxNzQ4NTE2MzQ2LCJqdGkiOiIyNTMyMGM0NWMwNDY0YmNhOTcyNjA2YmFiYmZiNDA1ZiIsInVzZXJfaWQiOiIxYzAzMzI2MC01YmU4LTRhNTktYThmMy05OTAwNzNmODkzMDcifQ.Hx9nBMAnohskRj7wLBZ016fDD6e9nyUIl-7W3U9Yy34	2025-05-29 13:59:06.746071+03	2025-06-05 13:59:06+03	1c033260-5be8-4a59-a8f3-990073f89307	25320c45c0464bca972606babbfb405f
17	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0OTEyMjQyMCwiaWF0IjoxNzQ4NTE3NjIwLCJqdGkiOiIzMDRjMDFiYWJlZTI0YzdkYmZmOTQwZjIwNTRhYWUwNCIsInVzZXJfaWQiOiIxYzAzMzI2MC01YmU4LTRhNTktYThmMy05OTAwNzNmODkzMDcifQ.UclH7Xyl2teapKjWeJUQqTo0S7Sy9T4eQalXp8DqQ3E	2025-05-29 14:20:20.804973+03	2025-06-05 14:20:20+03	1c033260-5be8-4a59-a8f3-990073f89307	304c01babee24c7dbff940f2054aae04
18	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0OTEzMjgxMiwiaWF0IjoxNzQ4NTI4MDEyLCJqdGkiOiI5ZmQ5NDJlNzIyMTA0ZGZmYWNiYzgyYzYxMWU0Y2ZjMCIsInVzZXJfaWQiOiIxYzAzMzI2MC01YmU4LTRhNTktYThmMy05OTAwNzNmODkzMDcifQ.ERXz22__CvJAxqpJrwkJAbt8aOVXWmlJ1LRxF4vvH7Q	2025-05-29 17:13:32.347633+03	2025-06-05 17:13:32+03	1c033260-5be8-4a59-a8f3-990073f89307	9fd942e722104dffacbc82c611e4cfc0
19	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0OTE0OTU0NCwiaWF0IjoxNzQ4NTQ0NzQ0LCJqdGkiOiI2YmVlZmFjYTVkOWU0OTBjOGQzY2IxYjMxYjFkMjg5ZCIsInVzZXJfaWQiOiIxYzAzMzI2MC01YmU4LTRhNTktYThmMy05OTAwNzNmODkzMDcifQ.WchpHpc2T1P1QMJKVpb087zD_rgIpkmKsRf786FstX8	2025-05-29 21:52:24.339073+03	2025-06-05 21:52:24+03	1c033260-5be8-4a59-a8f3-990073f89307	6beefaca5d9e490c8d3cb1b31b1d289d
20	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0OTIwOTA4NiwiaWF0IjoxNzQ4NjA0Mjg2LCJqdGkiOiJhMzAyZjkwYTc5Y2I0MGU1OTIwZmE2NzBkYTUyOGI2MiIsInVzZXJfaWQiOiIxYzAzMzI2MC01YmU4LTRhNTktYThmMy05OTAwNzNmODkzMDcifQ.umTsIleBYpc5q0QR8nuiJEmtkVCn6_wQiwLpZXI4gxM	2025-05-30 14:24:46.605126+03	2025-06-06 14:24:46+03	1c033260-5be8-4a59-a8f3-990073f89307	a302f90a79cb40e5920fa670da528b62
21	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0OTI3Njg2MiwiaWF0IjoxNzQ4NjcyMDYyLCJqdGkiOiI3YjFmNzYyZmZhODk0OTJjYjk3YWYzYjJkODhhN2NiOSIsInVzZXJfaWQiOiIxYzAzMzI2MC01YmU4LTRhNTktYThmMy05OTAwNzNmODkzMDcifQ.reTt2wESHnNt_S9nAhjRRT-r730OcjCD6FPJv7HXunQ	2025-05-31 09:14:22.075934+03	2025-06-07 09:14:22+03	1c033260-5be8-4a59-a8f3-990073f89307	7b1f762ffa89492cb97af3b2d88a7cb9
22	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0OTI4NDExMCwiaWF0IjoxNzQ4Njc5MzEwLCJqdGkiOiJiM2I4YTdmNjAxNzU0NGE1YjU5MjM3YmE0NDllNzAzMyIsInVzZXJfaWQiOiIxYzAzMzI2MC01YmU4LTRhNTktYThmMy05OTAwNzNmODkzMDcifQ.VNtsIzC4REF48EAAWfZxuP_POkzAcK2OT1td-yOj3nM	2025-05-31 11:15:10.382923+03	2025-06-07 11:15:10+03	1c033260-5be8-4a59-a8f3-990073f89307	b3b8a7f6017544a5b59237ba449e7033
23	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0OTI4NDUzOCwiaWF0IjoxNzQ4Njc5NzM4LCJqdGkiOiIyNzViMWYxZjMxNzY0MGNkYWI5NWQyOGM4ZmQwY2Q1ZiIsInVzZXJfaWQiOiIyMmViZTVhNy1lZjBmLTQ4MjktOWZhYy05ZjVlMDRkMGY2ZmIifQ.aUv5h-GU19TeSQZCfEo4ls_NCVE77GMu3iOiNqUASFc	2025-05-31 11:22:18.385878+03	2025-06-07 11:22:18+03	22ebe5a7-ef0f-4829-9fac-9f5e04d0f6fb	275b1f1f317640cdab95d28c8fd0cd5f
24	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0OTI4NTIwOSwiaWF0IjoxNzQ4NjgwNDA5LCJqdGkiOiIzMzZlNzY4NGY5MDQ0YjA4OWYwYzBkMTE1YmQ1MTgzNCIsInVzZXJfaWQiOiIxYzAzMzI2MC01YmU4LTRhNTktYThmMy05OTAwNzNmODkzMDcifQ.oRCWDpZhvsWfPZl3rnvTbL74lgl4mgd5jzsFBEIjlgQ	2025-05-31 11:33:29.422058+03	2025-06-07 11:33:29+03	1c033260-5be8-4a59-a8f3-990073f89307	336e7684f9044b089f0c0d115bd51834
25	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0OTI4NTIzMSwiaWF0IjoxNzQ4NjgwNDMxLCJqdGkiOiI1YmRhNjRlOTA1MzU0MGZjOGEyOTBjZjQzMWRiNTkwMyIsInVzZXJfaWQiOiIyMmViZTVhNy1lZjBmLTQ4MjktOWZhYy05ZjVlMDRkMGY2ZmIifQ.8TVd7sNR1Qzvxq_kiDsbRC59PLoveikU8coUvu_FepQ	2025-05-31 11:33:51.836612+03	2025-06-07 11:33:51+03	22ebe5a7-ef0f-4829-9fac-9f5e04d0f6fb	5bda64e9053540fc8a290cf431db5903
26	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0OTI4NTk3NiwiaWF0IjoxNzQ4NjgxMTc2LCJqdGkiOiI1MzJkY2U2NjRjY2E0ZTk2OTVmZjg1ZmVkMDZiMjY2NiIsInVzZXJfaWQiOiIxYzAzMzI2MC01YmU4LTRhNTktYThmMy05OTAwNzNmODkzMDcifQ.lxw_zRNnLPUg7wOSMgDHmlNpl6ZRsK2LiSia8hZOYyA	2025-05-31 11:46:16.952909+03	2025-06-07 11:46:16+03	1c033260-5be8-4a59-a8f3-990073f89307	532dce664cca4e9695ff85fed06b2666
27	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0OTI4NjIwMiwiaWF0IjoxNzQ4NjgxNDAyLCJqdGkiOiI1Zjg2Y2FjMjIwZjI0YmUzODY1NDg0MjQxODNjYzFlMyIsInVzZXJfaWQiOiIyMmViZTVhNy1lZjBmLTQ4MjktOWZhYy05ZjVlMDRkMGY2ZmIifQ.I_Bfx2kKB79JCht-ppXqLF8giFev4evOb49Z8BNx2M4	2025-05-31 11:50:02.260303+03	2025-06-07 11:50:02+03	22ebe5a7-ef0f-4829-9fac-9f5e04d0f6fb	5f86cac220f24be386548424183cc1e3
28	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0OTI4Njc2MiwiaWF0IjoxNzQ4NjgxOTYyLCJqdGkiOiIwY2QyYzFhY2ExMDE0ZDNjODYyYzA5Zjk5Yjc4NDJlZCIsInVzZXJfaWQiOiIyMmViZTVhNy1lZjBmLTQ4MjktOWZhYy05ZjVlMDRkMGY2ZmIifQ.2EkMwbiEJN8gIc33Ng-9Bu1vkmpWyq-TJ3B26wB0k2U	2025-05-31 11:59:22.649741+03	2025-06-07 11:59:22+03	22ebe5a7-ef0f-4829-9fac-9f5e04d0f6fb	0cd2c1aca1014d3c862c09f99b7842ed
29	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0OTI4NjgwNiwiaWF0IjoxNzQ4NjgyMDA2LCJqdGkiOiJkYWM2YTRkMjk5MDM0MDMxOTdmZjlkYThkNzA5ZDliMiIsInVzZXJfaWQiOiIyMmViZTVhNy1lZjBmLTQ4MjktOWZhYy05ZjVlMDRkMGY2ZmIifQ.Zhaq9BCv8KX6fKvLOzHSUefzgk2PuERZjpTvISSIUCI	2025-05-31 12:00:06.09117+03	2025-06-07 12:00:06+03	22ebe5a7-ef0f-4829-9fac-9f5e04d0f6fb	dac6a4d29903403197ff9da8d709d9b2
30	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0OTI4NzIzNCwiaWF0IjoxNzQ4NjgyNDM0LCJqdGkiOiJlMGJkYzQwMjgzYjc0NmVlODc0NDc2MTFmYTMxNDkwOCIsInVzZXJfaWQiOiIxYzAzMzI2MC01YmU4LTRhNTktYThmMy05OTAwNzNmODkzMDcifQ.-7fDJL5vgEWu6dAvGTO6lF9Wd935FpoumiMV6tN8_j0	2025-05-31 12:07:14.040863+03	2025-06-07 12:07:14+03	1c033260-5be8-4a59-a8f3-990073f89307	e0bdc40283b746ee87447611fa314908
31	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0OTI5MDIxOSwiaWF0IjoxNzQ4Njg1NDE5LCJqdGkiOiJkODBjZjc3ZWU2Njc0ODJlODNiMGNiZGE3MjZmYWRkYiIsInVzZXJfaWQiOiIyMmViZTVhNy1lZjBmLTQ4MjktOWZhYy05ZjVlMDRkMGY2ZmIifQ.hIY8OPLq1GHarupxGDEPiLsLSpNps8z_zj5p5bEjxhE	2025-05-31 12:56:59.063504+03	2025-06-07 12:56:59+03	22ebe5a7-ef0f-4829-9fac-9f5e04d0f6fb	d80cf77ee667482e83b0cbda726faddb
32	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0OTI5MDQzOCwiaWF0IjoxNzQ4Njg1NjM4LCJqdGkiOiI1MzAzN2UwODA3MzE0NTMxOGE1ZjA5YThiNTQxZjMxYiIsInVzZXJfaWQiOiIxYzAzMzI2MC01YmU4LTRhNTktYThmMy05OTAwNzNmODkzMDcifQ.wnGKwQzXw3Faisx7UdUE4uGcdr8hND0AQBGHTBYT7TE	2025-05-31 13:00:38.052282+03	2025-06-07 13:00:38+03	1c033260-5be8-4a59-a8f3-990073f89307	53037e08073145318a5f09a8b541f31b
33	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0OTI5MTcyOSwiaWF0IjoxNzQ4Njg2OTI5LCJqdGkiOiIwZWE4NDg3MmQ5Njc0YzE0OTI5NTQ3YWJiOTNkZTlhYSIsInVzZXJfaWQiOiIxYzAzMzI2MC01YmU4LTRhNTktYThmMy05OTAwNzNmODkzMDcifQ.0lgGTWTVcQ89SpxcLDlKmiTLS86S4muXNCywPrQ8YqQ	2025-05-31 13:22:09.906318+03	2025-06-07 13:22:09+03	1c033260-5be8-4a59-a8f3-990073f89307	0ea84872d9674c14929547abb93de9aa
34	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0OTI5MjYyMywiaWF0IjoxNzQ4Njg3ODIzLCJqdGkiOiJlYmNlMWIwNDgwMmQ0NzczYjg3NzgxYTY1MmFkZjllNCIsInVzZXJfaWQiOiIxYzAzMzI2MC01YmU4LTRhNTktYThmMy05OTAwNzNmODkzMDcifQ.VYEAO0UN4egGVE9dg7F9QK9_lom7c9kWbKBdm-SbTgM	2025-05-31 13:37:03.969418+03	2025-06-07 13:37:03+03	1c033260-5be8-4a59-a8f3-990073f89307	ebce1b04802d4773b87781a652adf9e4
35	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0OTM5Mzc3MiwiaWF0IjoxNzQ4Nzg4OTcyLCJqdGkiOiJjZjYxZWJmMWQ4Y2I0MmQwYTkyZTc4OTQ5ZmJhMDgzNiIsInVzZXJfaWQiOiIxYzAzMzI2MC01YmU4LTRhNTktYThmMy05OTAwNzNmODkzMDcifQ.HKR7PFwBXzLcGj6X24Q6hOMgszc2SiL5vdJEg7LCImo	2025-06-01 17:42:52.929684+03	2025-06-08 17:42:52+03	1c033260-5be8-4a59-a8f3-990073f89307	cf61ebf1d8cb42d0a92e78949fba0836
36	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0OTM5NDQzMCwiaWF0IjoxNzQ4Nzg5NjMwLCJqdGkiOiIyYWI2ZWFlMGU1Mjk0NDNiYjdiOGY3MGJhNGUzMDNiMyIsInVzZXJfaWQiOiIxYzAzMzI2MC01YmU4LTRhNTktYThmMy05OTAwNzNmODkzMDcifQ.Wbbh4WV9rf7M3tEMxg7b3R0_zT7hKNWhopBtqOACRvg	2025-06-01 17:53:50.913432+03	2025-06-08 17:53:50+03	1c033260-5be8-4a59-a8f3-990073f89307	2ab6eae0e529443bb7b8f70ba4e303b3
37	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0OTM5NTc3OSwiaWF0IjoxNzQ4NzkwOTc5LCJqdGkiOiIwNDY3ZjQ5ZDBhYWU0NzA2ODk1NjMyOTg0ZGQyNTJiZCIsInVzZXJfaWQiOiIxYzAzMzI2MC01YmU4LTRhNTktYThmMy05OTAwNzNmODkzMDcifQ.jle-m73wbC97S2K1YAoBh8UiyW0o2Wa9_3Ib0Ibok7Y	2025-06-01 18:16:19.014822+03	2025-06-08 18:16:19+03	1c033260-5be8-4a59-a8f3-990073f89307	0467f49d0aae4706895632984dd252bd
38	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0OTUzNzQxNCwiaWF0IjoxNzQ4OTMyNjE0LCJqdGkiOiIyZjM3NmYyMGEzM2E0ZDU0OGRmYzQxNWExNjk3NWZlNiIsInVzZXJfaWQiOiIxYzAzMzI2MC01YmU4LTRhNTktYThmMy05OTAwNzNmODkzMDcifQ._mjdfcg3Pc2T5xGBxby2WxvEsBXp8GLAbxNCDDFVyXw	2025-06-03 09:36:54.46322+03	2025-06-10 09:36:54+03	1c033260-5be8-4a59-a8f3-990073f89307	2f376f20a33a4d548dfc415a16975fe6
39	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0OTUzNzQ4OSwiaWF0IjoxNzQ4OTMyNjg5LCJqdGkiOiJkMTdiNzhjZDM0MDA0MDA0OTNhZjkzNzlhMDE0ZTljZCIsInVzZXJfaWQiOiIxYzAzMzI2MC01YmU4LTRhNTktYThmMy05OTAwNzNmODkzMDcifQ.kf9oHeB-O9EYSF5Gl3j5KMqfOv6hfRijybknehWM-9c	2025-06-03 09:38:09.370099+03	2025-06-10 09:38:09+03	1c033260-5be8-4a59-a8f3-990073f89307	d17b78cd3400400493af9379a014e9cd
40	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0OTUzODI1OCwiaWF0IjoxNzQ4OTMzNDU4LCJqdGkiOiJkYmRjOGI1NGJiZDU0Y2YyYjU3NTIyZWI1N2YzZjFlMiIsInVzZXJfaWQiOiIxYzAzMzI2MC01YmU4LTRhNTktYThmMy05OTAwNzNmODkzMDcifQ.gZkxwXwoPvsib-TN0xWUz6PuxqEIaihh9cmUDbpwkmc	2025-06-03 09:50:58.609202+03	2025-06-10 09:50:58+03	1c033260-5be8-4a59-a8f3-990073f89307	dbdc8b54bbd54cf2b57522eb57f3f1e2
41	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0OTY0NjQ1NywiaWF0IjoxNzQ5MDQxNjU3LCJqdGkiOiJhM2MyMDkyN2JmNmM0OGNmODM2ZDdmMjhiZGY4YmNmMiIsInVzZXJfaWQiOiIxYzAzMzI2MC01YmU4LTRhNTktYThmMy05OTAwNzNmODkzMDcifQ.uIATgLuPZcoxZx8-sK4DG1BRwkf-tXif9EY9Aj_YV8k	2025-06-04 15:54:17.693734+03	2025-06-11 15:54:17+03	1c033260-5be8-4a59-a8f3-990073f89307	a3c20927bf6c48cf836d7f28bdf8bcf2
42	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0OTY0NzgyMywiaWF0IjoxNzQ5MDQzMDIzLCJqdGkiOiI5OTMwOTYzZjk0NTc0ZDRhYTlkMTYxYzliNjc3NjE5MCIsInVzZXJfaWQiOiIxYzAzMzI2MC01YmU4LTRhNTktYThmMy05OTAwNzNmODkzMDcifQ.LOXscECW11ocbd8qDWpsfhQ3YZ_dluZB0B1MCuqcVoM	2025-06-04 16:17:03.954543+03	2025-06-11 16:17:03+03	1c033260-5be8-4a59-a8f3-990073f89307	9930963f94574d4aa9d161c9b6776190
43	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0OTc0OTg1MCwiaWF0IjoxNzQ5MTQ1MDUwLCJqdGkiOiI1MDc2M2QxZTYzMTM0ZDZiYmY3NDZhYWYyMjk2ZmYwNCIsInVzZXJfaWQiOiIxYzAzMzI2MC01YmU4LTRhNTktYThmMy05OTAwNzNmODkzMDcifQ.YF5wIzoOqHQ-o8cjAuz2DoYMdqw6UTB6gJreSKX4bMY	2025-06-05 20:37:30.539842+03	2025-06-12 20:37:30+03	1c033260-5be8-4a59-a8f3-990073f89307	50763d1e63134d6bbf746aaf2296ff04
44	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0OTc2NzI0MywiaWF0IjoxNzQ5MTYyNDQzLCJqdGkiOiI0NmRlMDRkNDAwYmE0NDZlYTgwNTM0ZjFmMzQ4MjlkNCIsInVzZXJfaWQiOiIxYzAzMzI2MC01YmU4LTRhNTktYThmMy05OTAwNzNmODkzMDcifQ.BDJZr7evbPCl5bchr_PvD3rGhGlJvfQOgArvXg0H27k	2025-06-06 01:27:23.555202+03	2025-06-13 01:27:23+03	1c033260-5be8-4a59-a8f3-990073f89307	46de04d400ba446ea80534f1f34829d4
45	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0OTc2ODUzMSwiaWF0IjoxNzQ5MTYzNzMxLCJqdGkiOiIwODcwMGNiODc3ZjA0NGQxOGIxMjNkYWMzYzQ2ZTgxMSIsInVzZXJfaWQiOiJiYzFhM2IyMS0zZjQ1LTQxNjUtODJjYy0zMDhiMWY5N2FlOTEifQ.uhX9tJKlAs6VZFmlKjDONu-cFLKDERObPX4ZlKD2mK8	2025-06-06 01:48:51.486265+03	2025-06-13 01:48:51+03	bc1a3b21-3f45-4165-82cc-308b1f97ae91	08700cb877f044d18b123dac3c46e811
46	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0OTgxMTczNywiaWF0IjoxNzQ5MjA2OTM3LCJqdGkiOiI5YWUwMmRmNDg3OWI0ZDkxOWI3OWZjMDVkMjk0NjA5NCIsInVzZXJfaWQiOiIxYzAzMzI2MC01YmU4LTRhNTktYThmMy05OTAwNzNmODkzMDcifQ.jtyttxXpygI4eaQocVAtB5yYtDj8DmVMtdpaPpyHxHA	2025-06-06 13:48:57.745987+03	2025-06-13 13:48:57+03	1c033260-5be8-4a59-a8f3-990073f89307	9ae02df4879b4d919b79fc05d2946094
47	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0OTgxMjMxNCwiaWF0IjoxNzQ5MjA3NTE0LCJqdGkiOiI3Yjg3MThlYjMzODI0MjcwOTZhMGJiN2QxZjA1Y2QwOSIsInVzZXJfaWQiOiIxYzAzMzI2MC01YmU4LTRhNTktYThmMy05OTAwNzNmODkzMDcifQ.Ps1ARU97GXVZ6YfWKonVSG-B1Bd0zAp_o6n4VHuTr6M	2025-06-06 13:58:34.513482+03	2025-06-13 13:58:34+03	1c033260-5be8-4a59-a8f3-990073f89307	7b8718eb3382427096a0bb7d1f05cd09
48	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0OTg5NTUzNywiaWF0IjoxNzQ5MjkwNzM3LCJqdGkiOiJkYWE1MDVhMjdjMWY0MzkyOWQ0ZGVlYjQ1NDNjNGFlZSIsInVzZXJfaWQiOiIxYzAzMzI2MC01YmU4LTRhNTktYThmMy05OTAwNzNmODkzMDcifQ.FRgzylYTBf0nFWM6mW0mHcac4JEMqN6ErjF6zMJRCB0	2025-06-07 13:05:37.070376+03	2025-06-14 13:05:37+03	1c033260-5be8-4a59-a8f3-990073f89307	daa505a27c1f43929d4deeb4543c4aee
49	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0OTg5OTAxOCwiaWF0IjoxNzQ5Mjk0MjE4LCJqdGkiOiI1ZDllMTJhNmNjNGU0NjYxYTUxMjQ5MzRhNmVmZWI5MyIsInVzZXJfaWQiOiIxYzAzMzI2MC01YmU4LTRhNTktYThmMy05OTAwNzNmODkzMDcifQ.iTr2tziTdVE3QeveSWoHmmr076X9bgFc-gJJvitxbzY	2025-06-07 14:03:38.831615+03	2025-06-14 14:03:38+03	1c033260-5be8-4a59-a8f3-990073f89307	5d9e12a6cc4e4661a5124934a6efeb93
50	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0OTkwMjk5OSwiaWF0IjoxNzQ5Mjk4MTk5LCJqdGkiOiIwY2E5YWE4MjQ1MWM0NmY1YjdiZWMzYWU1NjJhNWU5YyIsInVzZXJfaWQiOiJiYzFhM2IyMS0zZjQ1LTQxNjUtODJjYy0zMDhiMWY5N2FlOTEifQ.bMXBY7V3GcQS-PlkbCFQCrbB124J8_eBFBsQ57m7hNc	2025-06-07 15:09:59.930034+03	2025-06-14 15:09:59+03	bc1a3b21-3f45-4165-82cc-308b1f97ae91	0ca9aa82451c46f5b7bec3ae562a5e9c
51	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0OTkwMzA0NSwiaWF0IjoxNzQ5Mjk4MjQ1LCJqdGkiOiI5N2M2NTYyZGU3MmE0ZTVkOGIxNTE3ZDc0N2ViYjBmYiIsInVzZXJfaWQiOiIxYzAzMzI2MC01YmU4LTRhNTktYThmMy05OTAwNzNmODkzMDcifQ.yWECE-aywPIM8ieAcZh1FNE_etO2nF1YTNwZTq8S6Zg	2025-06-07 15:10:45.713281+03	2025-06-14 15:10:45+03	1c033260-5be8-4a59-a8f3-990073f89307	97c6562de72a4e5d8b1517d747ebb0fb
52	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0OTkwNDU3NiwiaWF0IjoxNzQ5Mjk5Nzc2LCJqdGkiOiI4ODM3M2Q3NjkxMTM0N2E3YjQwMTA5ZDk0ZGExZjMyMCIsInVzZXJfaWQiOiJiYzFhM2IyMS0zZjQ1LTQxNjUtODJjYy0zMDhiMWY5N2FlOTEifQ.MJK6fpKpLDmfx9W02xHVsDsgfMYGahnO8zxksumuc_s	2025-06-07 15:36:16.962763+03	2025-06-14 15:36:16+03	bc1a3b21-3f45-4165-82cc-308b1f97ae91	88373d76911347a7b40109d94da1f320
53	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0OTkwNzMyMCwiaWF0IjoxNzQ5MzAyNTIwLCJqdGkiOiI3MDM1MmI2MzAzYjM0ZDNhOTQyZjJiNmY4ZDU1NGZkYiIsInVzZXJfaWQiOiIxYzAzMzI2MC01YmU4LTRhNTktYThmMy05OTAwNzNmODkzMDcifQ.zi3J_Tgh0qSwWhp8nD_1Q48lJ3rbuOhcx-rP-bZieUc	2025-06-07 16:22:00.666457+03	2025-06-14 16:22:00+03	1c033260-5be8-4a59-a8f3-990073f89307	70352b6303b34d3a942f2b6f8d554fdb
54	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0OTkwNzgyMSwiaWF0IjoxNzQ5MzAzMDIxLCJqdGkiOiI3NjMwNmI1NGZkM2Y0ODY0ODEzMWRjOTMyYTc0MzY2YiIsInVzZXJfaWQiOiIxYzAzMzI2MC01YmU4LTRhNTktYThmMy05OTAwNzNmODkzMDcifQ.waTrcLBVOv4NAp3c8vxU_GEBMbzqe5Q3BMRjVdn8SUw	2025-06-07 16:30:21.412141+03	2025-06-14 16:30:21+03	1c033260-5be8-4a59-a8f3-990073f89307	76306b54fd3f48648131dc932a74366b
\.


--
-- Name: accounts_user_groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.accounts_user_groups_id_seq', 1, false);


--
-- Name: accounts_user_user_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.accounts_user_user_permissions_id_seq', 1, false);


--
-- Name: auth_group_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.auth_group_id_seq', 1, false);


--
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.auth_group_permissions_id_seq', 1, false);


--
-- Name: auth_permission_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.auth_permission_id_seq', 124, true);


--
-- Name: core_recyclebinitem_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.core_recyclebinitem_id_seq', 25, true);


--
-- Name: divisions_division_leads_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.divisions_division_leads_id_seq', 2, true);


--
-- Name: divisions_program_maintainers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.divisions_program_maintainers_id_seq', 4, true);


--
-- Name: django_admin_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.django_admin_log_id_seq', 1, true);


--
-- Name: django_celery_beat_clockedschedule_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.django_celery_beat_clockedschedule_id_seq', 1, false);


--
-- Name: django_celery_beat_crontabschedule_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.django_celery_beat_crontabschedule_id_seq', 4, true);


--
-- Name: django_celery_beat_intervalschedule_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.django_celery_beat_intervalschedule_id_seq', 1, false);


--
-- Name: django_celery_beat_periodictask_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.django_celery_beat_periodictask_id_seq', 4, true);


--
-- Name: django_celery_beat_solarschedule_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.django_celery_beat_solarschedule_id_seq', 1, false);


--
-- Name: django_content_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.django_content_type_id_seq', 31, true);


--
-- Name: django_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.django_migrations_id_seq', 72, true);


--
-- Name: documents_bankstatementaccessrequest_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.documents_bankstatementaccessrequest_id_seq', 10, true);


--
-- Name: documents_document_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.documents_document_id_seq', 16, true);


--
-- Name: grants_grant_required_documents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.grants_grant_required_documents_id_seq', 1, true);


--
-- Name: grants_grant_submitted_documents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.grants_grant_submitted_documents_id_seq', 1, false);


--
-- Name: token_blacklist_blacklistedtoken_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.token_blacklist_blacklistedtoken_id_seq', 30, true);


--
-- Name: token_blacklist_outstandingtoken_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.token_blacklist_outstandingtoken_id_seq', 54, true);


--
-- Name: accounts_user accounts_user_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accounts_user
    ADD CONSTRAINT accounts_user_email_key UNIQUE (email);


--
-- Name: accounts_user_groups accounts_user_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accounts_user_groups
    ADD CONSTRAINT accounts_user_groups_pkey PRIMARY KEY (id);


--
-- Name: accounts_user_groups accounts_user_groups_user_id_group_id_59c0b32f_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accounts_user_groups
    ADD CONSTRAINT accounts_user_groups_user_id_group_id_59c0b32f_uniq UNIQUE (user_id, group_id);


--
-- Name: accounts_user accounts_user_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accounts_user
    ADD CONSTRAINT accounts_user_pkey PRIMARY KEY (id);


--
-- Name: accounts_user_user_permissions accounts_user_user_permi_user_id_permission_id_2ab516c2_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accounts_user_user_permissions
    ADD CONSTRAINT accounts_user_user_permi_user_id_permission_id_2ab516c2_uniq UNIQUE (user_id, permission_id);


--
-- Name: accounts_user_user_permissions accounts_user_user_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accounts_user_user_permissions
    ADD CONSTRAINT accounts_user_user_permissions_pkey PRIMARY KEY (id);


--
-- Name: auth_group auth_group_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_group
    ADD CONSTRAINT auth_group_name_key UNIQUE (name);


--
-- Name: auth_group_permissions auth_group_permissions_group_id_permission_id_0cd325b0_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_group_id_permission_id_0cd325b0_uniq UNIQUE (group_id, permission_id);


--
-- Name: auth_group_permissions auth_group_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_pkey PRIMARY KEY (id);


--
-- Name: auth_group auth_group_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_group
    ADD CONSTRAINT auth_group_pkey PRIMARY KEY (id);


--
-- Name: auth_permission auth_permission_content_type_id_codename_01ab375a_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_content_type_id_codename_01ab375a_uniq UNIQUE (content_type_id, codename);


--
-- Name: auth_permission auth_permission_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_pkey PRIMARY KEY (id);


--
-- Name: authtoken_token authtoken_token_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authtoken_token
    ADD CONSTRAINT authtoken_token_pkey PRIMARY KEY (key);


--
-- Name: authtoken_token authtoken_token_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authtoken_token
    ADD CONSTRAINT authtoken_token_user_id_key UNIQUE (user_id);


--
-- Name: core_recyclebinitem core_recyclebinitem_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.core_recyclebinitem
    ADD CONSTRAINT core_recyclebinitem_pkey PRIMARY KEY (id);


--
-- Name: divisions_division_leads divisions_division_leads_division_id_user_id_85d42e10_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.divisions_division_leads
    ADD CONSTRAINT divisions_division_leads_division_id_user_id_85d42e10_uniq UNIQUE (division_id, user_id);


--
-- Name: divisions_division_leads divisions_division_leads_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.divisions_division_leads
    ADD CONSTRAINT divisions_division_leads_pkey PRIMARY KEY (id);


--
-- Name: divisions_division divisions_division_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.divisions_division
    ADD CONSTRAINT divisions_division_name_key UNIQUE (name);


--
-- Name: divisions_division divisions_division_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.divisions_division
    ADD CONSTRAINT divisions_division_pkey PRIMARY KEY (id);


--
-- Name: divisions_educationprogramdetail divisions_educationprogramdetail_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.divisions_educationprogramdetail
    ADD CONSTRAINT divisions_educationprogramdetail_pkey PRIMARY KEY (id);


--
-- Name: divisions_educationprogramdetail divisions_educationprogramdetail_student_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.divisions_educationprogramdetail
    ADD CONSTRAINT divisions_educationprogramdetail_student_name_key UNIQUE (student_name);


--
-- Name: divisions_microfundprogramdetail divisions_microfundprogramdetail_person_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.divisions_microfundprogramdetail
    ADD CONSTRAINT divisions_microfundprogramdetail_person_name_key UNIQUE (person_name);


--
-- Name: divisions_microfundprogramdetail divisions_microfundprogramdetail_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.divisions_microfundprogramdetail
    ADD CONSTRAINT divisions_microfundprogramdetail_pkey PRIMARY KEY (id);


--
-- Name: divisions_program_maintainers divisions_program_maintainers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.divisions_program_maintainers
    ADD CONSTRAINT divisions_program_maintainers_pkey PRIMARY KEY (id);


--
-- Name: divisions_program_maintainers divisions_program_maintainers_program_id_user_id_527d8fa1_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.divisions_program_maintainers
    ADD CONSTRAINT divisions_program_maintainers_program_id_user_id_527d8fa1_uniq UNIQUE (program_id, user_id);


--
-- Name: divisions_program divisions_program_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.divisions_program
    ADD CONSTRAINT divisions_program_name_key UNIQUE (name);


--
-- Name: divisions_program divisions_program_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.divisions_program
    ADD CONSTRAINT divisions_program_pkey PRIMARY KEY (id);


--
-- Name: divisions_rescueprogramdetail divisions_rescueprogramdetail_child_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.divisions_rescueprogramdetail
    ADD CONSTRAINT divisions_rescueprogramdetail_child_name_key UNIQUE (child_name);


--
-- Name: divisions_rescueprogramdetail divisions_rescueprogramdetail_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.divisions_rescueprogramdetail
    ADD CONSTRAINT divisions_rescueprogramdetail_pkey PRIMARY KEY (id);


--
-- Name: divisions_vocationaltrainingprogramtraineedetail divisions_vocationaltrainingprogramtraineedeta_trainee_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.divisions_vocationaltrainingprogramtraineedetail
    ADD CONSTRAINT divisions_vocationaltrainingprogramtraineedeta_trainee_name_key UNIQUE (trainee_name);


--
-- Name: divisions_vocationaltrainingprogramtraineedetail divisions_vocationaltrainingprogramtraineedetail_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.divisions_vocationaltrainingprogramtraineedetail
    ADD CONSTRAINT divisions_vocationaltrainingprogramtraineedetail_pkey PRIMARY KEY (id);


--
-- Name: divisions_vocationaltrainingprogramtrainerdetail divisions_vocationaltrainingprogramtrainerdeta_trainer_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.divisions_vocationaltrainingprogramtrainerdetail
    ADD CONSTRAINT divisions_vocationaltrainingprogramtrainerdeta_trainer_name_key UNIQUE (trainer_name);


--
-- Name: divisions_vocationaltrainingprogramtrainerdetail divisions_vocationaltrainingprogramtrainerdetail_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.divisions_vocationaltrainingprogramtrainerdetail
    ADD CONSTRAINT divisions_vocationaltrainingprogramtrainerdetail_pkey PRIMARY KEY (id);


--
-- Name: django_admin_log django_admin_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_pkey PRIMARY KEY (id);


--
-- Name: django_celery_beat_clockedschedule django_celery_beat_clockedschedule_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_celery_beat_clockedschedule
    ADD CONSTRAINT django_celery_beat_clockedschedule_pkey PRIMARY KEY (id);


--
-- Name: django_celery_beat_crontabschedule django_celery_beat_crontabschedule_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_celery_beat_crontabschedule
    ADD CONSTRAINT django_celery_beat_crontabschedule_pkey PRIMARY KEY (id);


--
-- Name: django_celery_beat_intervalschedule django_celery_beat_intervalschedule_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_celery_beat_intervalschedule
    ADD CONSTRAINT django_celery_beat_intervalschedule_pkey PRIMARY KEY (id);


--
-- Name: django_celery_beat_periodictask django_celery_beat_periodictask_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_celery_beat_periodictask
    ADD CONSTRAINT django_celery_beat_periodictask_name_key UNIQUE (name);


--
-- Name: django_celery_beat_periodictask django_celery_beat_periodictask_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_celery_beat_periodictask
    ADD CONSTRAINT django_celery_beat_periodictask_pkey PRIMARY KEY (id);


--
-- Name: django_celery_beat_periodictasks django_celery_beat_periodictasks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_celery_beat_periodictasks
    ADD CONSTRAINT django_celery_beat_periodictasks_pkey PRIMARY KEY (ident);


--
-- Name: django_celery_beat_solarschedule django_celery_beat_solar_event_latitude_longitude_ba64999a_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_celery_beat_solarschedule
    ADD CONSTRAINT django_celery_beat_solar_event_latitude_longitude_ba64999a_uniq UNIQUE (event, latitude, longitude);


--
-- Name: django_celery_beat_solarschedule django_celery_beat_solarschedule_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_celery_beat_solarschedule
    ADD CONSTRAINT django_celery_beat_solarschedule_pkey PRIMARY KEY (id);


--
-- Name: django_content_type django_content_type_app_label_model_76bd3d3b_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_content_type
    ADD CONSTRAINT django_content_type_app_label_model_76bd3d3b_uniq UNIQUE (app_label, model);


--
-- Name: django_content_type django_content_type_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_content_type
    ADD CONSTRAINT django_content_type_pkey PRIMARY KEY (id);


--
-- Name: django_migrations django_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_migrations
    ADD CONSTRAINT django_migrations_pkey PRIMARY KEY (id);


--
-- Name: django_session django_session_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_session
    ADD CONSTRAINT django_session_pkey PRIMARY KEY (session_key);


--
-- Name: documents_bankstatementaccessrequest documents_bankstatementaccessrequest_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.documents_bankstatementaccessrequest
    ADD CONSTRAINT documents_bankstatementaccessrequest_pkey PRIMARY KEY (id);


--
-- Name: documents_document documents_document_name_aaa90b9f_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.documents_document
    ADD CONSTRAINT documents_document_name_aaa90b9f_uniq UNIQUE (name);


--
-- Name: documents_document documents_document_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.documents_document
    ADD CONSTRAINT documents_document_pkey PRIMARY KEY (id);


--
-- Name: email_templates_emailtemplates email_templates_emailtemplates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_templates_emailtemplates
    ADD CONSTRAINT email_templates_emailtemplates_pkey PRIMARY KEY (id);


--
-- Name: grants_grant grants_grant_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grants_grant
    ADD CONSTRAINT grants_grant_pkey PRIMARY KEY (id);


--
-- Name: grants_grant_required_documents grants_grant_required_do_grant_id_document_id_83bd28e0_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grants_grant_required_documents
    ADD CONSTRAINT grants_grant_required_do_grant_id_document_id_83bd28e0_uniq UNIQUE (grant_id, document_id);


--
-- Name: grants_grant_required_documents grants_grant_required_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grants_grant_required_documents
    ADD CONSTRAINT grants_grant_required_documents_pkey PRIMARY KEY (id);


--
-- Name: grants_grant_submitted_documents grants_grant_submitted_d_grant_id_document_id_05b56453_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grants_grant_submitted_documents
    ADD CONSTRAINT grants_grant_submitted_d_grant_id_document_id_05b56453_uniq UNIQUE (grant_id, document_id);


--
-- Name: grants_grant_submitted_documents grants_grant_submitted_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grants_grant_submitted_documents
    ADD CONSTRAINT grants_grant_submitted_documents_pkey PRIMARY KEY (id);


--
-- Name: grants_grantexpenditure grants_grantexpenditure_grant_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grants_grantexpenditure
    ADD CONSTRAINT grants_grantexpenditure_grant_id_key UNIQUE (grant_id);


--
-- Name: grants_grantexpenditure grants_grantexpenditure_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grants_grantexpenditure
    ADD CONSTRAINT grants_grantexpenditure_pkey PRIMARY KEY (id);


--
-- Name: notifications_notification notifications_notification_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications_notification
    ADD CONSTRAINT notifications_notification_pkey PRIMARY KEY (id);


--
-- Name: task_manager_task task_manager_task_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.task_manager_task
    ADD CONSTRAINT task_manager_task_pkey PRIMARY KEY (id);


--
-- Name: token_blacklist_blacklistedtoken token_blacklist_blacklistedtoken_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.token_blacklist_blacklistedtoken
    ADD CONSTRAINT token_blacklist_blacklistedtoken_pkey PRIMARY KEY (id);


--
-- Name: token_blacklist_blacklistedtoken token_blacklist_blacklistedtoken_token_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.token_blacklist_blacklistedtoken
    ADD CONSTRAINT token_blacklist_blacklistedtoken_token_id_key UNIQUE (token_id);


--
-- Name: token_blacklist_outstandingtoken token_blacklist_outstandingtoken_jti_hex_d9bdf6f7_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.token_blacklist_outstandingtoken
    ADD CONSTRAINT token_blacklist_outstandingtoken_jti_hex_d9bdf6f7_uniq UNIQUE (jti);


--
-- Name: token_blacklist_outstandingtoken token_blacklist_outstandingtoken_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.token_blacklist_outstandingtoken
    ADD CONSTRAINT token_blacklist_outstandingtoken_pkey PRIMARY KEY (id);


--
-- Name: accounts_user_email_b2644a56_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX accounts_user_email_b2644a56_like ON public.accounts_user USING btree (email varchar_pattern_ops);


--
-- Name: accounts_user_groups_group_id_bd11a704; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX accounts_user_groups_group_id_bd11a704 ON public.accounts_user_groups USING btree (group_id);


--
-- Name: accounts_user_groups_user_id_52b62117; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX accounts_user_groups_user_id_52b62117 ON public.accounts_user_groups USING btree (user_id);


--
-- Name: accounts_user_user_permissions_permission_id_113bb443; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX accounts_user_user_permissions_permission_id_113bb443 ON public.accounts_user_user_permissions USING btree (permission_id);


--
-- Name: accounts_user_user_permissions_user_id_e4f0a161; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX accounts_user_user_permissions_user_id_e4f0a161 ON public.accounts_user_user_permissions USING btree (user_id);


--
-- Name: auth_group_name_a6ea08ec_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX auth_group_name_a6ea08ec_like ON public.auth_group USING btree (name varchar_pattern_ops);


--
-- Name: auth_group_permissions_group_id_b120cbf9; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX auth_group_permissions_group_id_b120cbf9 ON public.auth_group_permissions USING btree (group_id);


--
-- Name: auth_group_permissions_permission_id_84c5c92e; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX auth_group_permissions_permission_id_84c5c92e ON public.auth_group_permissions USING btree (permission_id);


--
-- Name: auth_permission_content_type_id_2f476e4b; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX auth_permission_content_type_id_2f476e4b ON public.auth_permission USING btree (content_type_id);


--
-- Name: authtoken_token_key_10f0b77e_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX authtoken_token_key_10f0b77e_like ON public.authtoken_token USING btree (key varchar_pattern_ops);


--
-- Name: core_recyclebinitem_content_type_id_f87b9c19; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX core_recyclebinitem_content_type_id_f87b9c19 ON public.core_recyclebinitem USING btree (content_type_id);


--
-- Name: core_recyclebinitem_deleted_by_id_73cc7883; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX core_recyclebinitem_deleted_by_id_73cc7883 ON public.core_recyclebinitem USING btree (deleted_by_id);


--
-- Name: core_recyclebinitem_restored_by_id_2ccd7e28; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX core_recyclebinitem_restored_by_id_2ccd7e28 ON public.core_recyclebinitem USING btree (restored_by_id);


--
-- Name: divisions_division_leads_division_id_0529c80f; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX divisions_division_leads_division_id_0529c80f ON public.divisions_division_leads USING btree (division_id);


--
-- Name: divisions_division_leads_user_id_e5c33636; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX divisions_division_leads_user_id_e5c33636 ON public.divisions_division_leads USING btree (user_id);


--
-- Name: divisions_division_name_b3a1b021_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX divisions_division_name_b3a1b021_like ON public.divisions_division USING btree (name varchar_pattern_ops);


--
-- Name: divisions_educationprogramdetail_created_by_id_27d523e7; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX divisions_educationprogramdetail_created_by_id_27d523e7 ON public.divisions_educationprogramdetail USING btree (created_by_id);


--
-- Name: divisions_educationprogramdetail_program_id_247df82c; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX divisions_educationprogramdetail_program_id_247df82c ON public.divisions_educationprogramdetail USING btree (program_id);


--
-- Name: divisions_educationprogramdetail_student_name_405f18ee_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX divisions_educationprogramdetail_student_name_405f18ee_like ON public.divisions_educationprogramdetail USING btree (student_name varchar_pattern_ops);


--
-- Name: divisions_educationprogramdetail_updated_by_id_4b7910f2; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX divisions_educationprogramdetail_updated_by_id_4b7910f2 ON public.divisions_educationprogramdetail USING btree (updated_by_id);


--
-- Name: divisions_microfundprogramdetail_created_by_id_bed73eec; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX divisions_microfundprogramdetail_created_by_id_bed73eec ON public.divisions_microfundprogramdetail USING btree (created_by_id);


--
-- Name: divisions_microfundprogramdetail_person_name_a45e9f68_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX divisions_microfundprogramdetail_person_name_a45e9f68_like ON public.divisions_microfundprogramdetail USING btree (person_name varchar_pattern_ops);


--
-- Name: divisions_microfundprogramdetail_program_id_af965baa; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX divisions_microfundprogramdetail_program_id_af965baa ON public.divisions_microfundprogramdetail USING btree (program_id);


--
-- Name: divisions_microfundprogramdetail_updated_by_id_bd2f8346; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX divisions_microfundprogramdetail_updated_by_id_bd2f8346 ON public.divisions_microfundprogramdetail USING btree (updated_by_id);


--
-- Name: divisions_program_division_id_82095a01; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX divisions_program_division_id_82095a01 ON public.divisions_program USING btree (division_id);


--
-- Name: divisions_program_maintainers_program_id_8a24a2b1; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX divisions_program_maintainers_program_id_8a24a2b1 ON public.divisions_program_maintainers USING btree (program_id);


--
-- Name: divisions_program_maintainers_user_id_1b5f848b; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX divisions_program_maintainers_user_id_1b5f848b ON public.divisions_program_maintainers USING btree (user_id);


--
-- Name: divisions_program_name_55f4dea5_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX divisions_program_name_55f4dea5_like ON public.divisions_program USING btree (name varchar_pattern_ops);


--
-- Name: divisions_rescueprogramdetail_child_name_792ff1df_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX divisions_rescueprogramdetail_child_name_792ff1df_like ON public.divisions_rescueprogramdetail USING btree (child_name varchar_pattern_ops);


--
-- Name: divisions_rescueprogramdetail_created_by_id_e97050ac; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX divisions_rescueprogramdetail_created_by_id_e97050ac ON public.divisions_rescueprogramdetail USING btree (created_by_id);


--
-- Name: divisions_rescueprogramdetail_program_id_4e745372; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX divisions_rescueprogramdetail_program_id_4e745372 ON public.divisions_rescueprogramdetail USING btree (program_id);


--
-- Name: divisions_rescueprogramdetail_updated_by_id_ac48ca74; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX divisions_rescueprogramdetail_updated_by_id_ac48ca74 ON public.divisions_rescueprogramdetail USING btree (updated_by_id);


--
-- Name: divisions_vocationaltrai_trainee_name_a2db428b_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX divisions_vocationaltrai_trainee_name_a2db428b_like ON public.divisions_vocationaltrainingprogramtraineedetail USING btree (trainee_name varchar_pattern_ops);


--
-- Name: divisions_vocationaltrai_trainer_name_1023b156_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX divisions_vocationaltrai_trainer_name_1023b156_like ON public.divisions_vocationaltrainingprogramtrainerdetail USING btree (trainer_name varchar_pattern_ops);


--
-- Name: divisions_vocationaltraini_created_by_id_0a1f07ed; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX divisions_vocationaltraini_created_by_id_0a1f07ed ON public.divisions_vocationaltrainingprogramtrainerdetail USING btree (created_by_id);


--
-- Name: divisions_vocationaltraini_created_by_id_79604231; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX divisions_vocationaltraini_created_by_id_79604231 ON public.divisions_vocationaltrainingprogramtraineedetail USING btree (created_by_id);


--
-- Name: divisions_vocationaltraini_program_id_ecf2f2f2; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX divisions_vocationaltraini_program_id_ecf2f2f2 ON public.divisions_vocationaltrainingprogramtrainerdetail USING btree (program_id);


--
-- Name: divisions_vocationaltraini_trainer_id_d756f924; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX divisions_vocationaltraini_trainer_id_d756f924 ON public.divisions_vocationaltrainingprogramtraineedetail USING btree (trainer_id);


--
-- Name: divisions_vocationaltraini_updated_by_id_6993a9b8; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX divisions_vocationaltraini_updated_by_id_6993a9b8 ON public.divisions_vocationaltrainingprogramtrainerdetail USING btree (updated_by_id);


--
-- Name: divisions_vocationaltraini_updated_by_id_7c271473; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX divisions_vocationaltraini_updated_by_id_7c271473 ON public.divisions_vocationaltrainingprogramtraineedetail USING btree (updated_by_id);


--
-- Name: django_admin_log_content_type_id_c4bce8eb; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX django_admin_log_content_type_id_c4bce8eb ON public.django_admin_log USING btree (content_type_id);


--
-- Name: django_admin_log_user_id_c564eba6; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX django_admin_log_user_id_c564eba6 ON public.django_admin_log USING btree (user_id);


--
-- Name: django_celery_beat_periodictask_clocked_id_47a69f82; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX django_celery_beat_periodictask_clocked_id_47a69f82 ON public.django_celery_beat_periodictask USING btree (clocked_id);


--
-- Name: django_celery_beat_periodictask_crontab_id_d3cba168; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX django_celery_beat_periodictask_crontab_id_d3cba168 ON public.django_celery_beat_periodictask USING btree (crontab_id);


--
-- Name: django_celery_beat_periodictask_interval_id_a8ca27da; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX django_celery_beat_periodictask_interval_id_a8ca27da ON public.django_celery_beat_periodictask USING btree (interval_id);


--
-- Name: django_celery_beat_periodictask_name_265a36b7_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX django_celery_beat_periodictask_name_265a36b7_like ON public.django_celery_beat_periodictask USING btree (name varchar_pattern_ops);


--
-- Name: django_celery_beat_periodictask_solar_id_a87ce72c; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX django_celery_beat_periodictask_solar_id_a87ce72c ON public.django_celery_beat_periodictask USING btree (solar_id);


--
-- Name: django_session_expire_date_a5c62663; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX django_session_expire_date_a5c62663 ON public.django_session USING btree (expire_date);


--
-- Name: django_session_session_key_c0390e0f_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX django_session_session_key_c0390e0f_like ON public.django_session USING btree (session_key varchar_pattern_ops);


--
-- Name: documents_bankstatementaccessrequest_document_id_db16dfa1; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX documents_bankstatementaccessrequest_document_id_db16dfa1 ON public.documents_bankstatementaccessrequest USING btree (document_id);


--
-- Name: documents_bankstatementaccessrequest_user_id_db88bc28; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX documents_bankstatementaccessrequest_user_id_db88bc28 ON public.documents_bankstatementaccessrequest USING btree (user_id);


--
-- Name: documents_document_name_aaa90b9f_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX documents_document_name_aaa90b9f_like ON public.documents_document USING btree (name varchar_pattern_ops);


--
-- Name: email_templates_emailtemplates_created_by_id_801c5250; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX email_templates_emailtemplates_created_by_id_801c5250 ON public.email_templates_emailtemplates USING btree (created_by_id);


--
-- Name: email_templates_emailtemplates_updated_by_id_1c57885f; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX email_templates_emailtemplates_updated_by_id_1c57885f ON public.email_templates_emailtemplates USING btree (updated_by_id);


--
-- Name: grants_grant_program_id_8d75710a; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX grants_grant_program_id_8d75710a ON public.grants_grant USING btree (program_id);


--
-- Name: grants_grant_required_documents_document_id_75244ebb; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX grants_grant_required_documents_document_id_75244ebb ON public.grants_grant_required_documents USING btree (document_id);


--
-- Name: grants_grant_required_documents_grant_id_125e5d91; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX grants_grant_required_documents_grant_id_125e5d91 ON public.grants_grant_required_documents USING btree (grant_id);


--
-- Name: grants_grant_submitted_by_id_fabea75b; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX grants_grant_submitted_by_id_fabea75b ON public.grants_grant USING btree (submitted_by_id);


--
-- Name: grants_grant_submitted_documents_document_id_a248f8a0; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX grants_grant_submitted_documents_document_id_a248f8a0 ON public.grants_grant_submitted_documents USING btree (document_id);


--
-- Name: grants_grant_submitted_documents_grant_id_6e327786; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX grants_grant_submitted_documents_grant_id_6e327786 ON public.grants_grant_submitted_documents USING btree (grant_id);


--
-- Name: notifications_notification_assigner_id_9af7d917; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX notifications_notification_assigner_id_9af7d917 ON public.notifications_notification USING btree (assigner_id);


--
-- Name: notifications_notification_recipient_id_d055f3f0; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX notifications_notification_recipient_id_d055f3f0 ON public.notifications_notification USING btree (recipient_id);


--
-- Name: task_manager_task_assigned_by_id_94ddebb1; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX task_manager_task_assigned_by_id_94ddebb1 ON public.task_manager_task USING btree (assigned_by_id);


--
-- Name: task_manager_task_assigned_to_id_aaf7f5f9; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX task_manager_task_assigned_to_id_aaf7f5f9 ON public.task_manager_task USING btree (assigned_to_id);


--
-- Name: task_manager_task_grant_id_5dd5c3dd; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX task_manager_task_grant_id_5dd5c3dd ON public.task_manager_task USING btree (grant_id);


--
-- Name: token_blacklist_outstandingtoken_jti_hex_d9bdf6f7_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX token_blacklist_outstandingtoken_jti_hex_d9bdf6f7_like ON public.token_blacklist_outstandingtoken USING btree (jti varchar_pattern_ops);


--
-- Name: token_blacklist_outstandingtoken_user_id_83bc629a; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX token_blacklist_outstandingtoken_user_id_83bc629a ON public.token_blacklist_outstandingtoken USING btree (user_id);


--
-- Name: accounts_user_groups accounts_user_groups_group_id_bd11a704_fk_auth_group_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accounts_user_groups
    ADD CONSTRAINT accounts_user_groups_group_id_bd11a704_fk_auth_group_id FOREIGN KEY (group_id) REFERENCES public.auth_group(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: accounts_user_groups accounts_user_groups_user_id_52b62117_fk_accounts_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accounts_user_groups
    ADD CONSTRAINT accounts_user_groups_user_id_52b62117_fk_accounts_user_id FOREIGN KEY (user_id) REFERENCES public.accounts_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: accounts_user_user_permissions accounts_user_user_p_permission_id_113bb443_fk_auth_perm; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accounts_user_user_permissions
    ADD CONSTRAINT accounts_user_user_p_permission_id_113bb443_fk_auth_perm FOREIGN KEY (permission_id) REFERENCES public.auth_permission(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: accounts_user_user_permissions accounts_user_user_p_user_id_e4f0a161_fk_accounts_; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accounts_user_user_permissions
    ADD CONSTRAINT accounts_user_user_p_user_id_e4f0a161_fk_accounts_ FOREIGN KEY (user_id) REFERENCES public.accounts_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_group_permissions auth_group_permissio_permission_id_84c5c92e_fk_auth_perm; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissio_permission_id_84c5c92e_fk_auth_perm FOREIGN KEY (permission_id) REFERENCES public.auth_permission(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_group_permissions auth_group_permissions_group_id_b120cbf9_fk_auth_group_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_group_id_b120cbf9_fk_auth_group_id FOREIGN KEY (group_id) REFERENCES public.auth_group(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_permission auth_permission_content_type_id_2f476e4b_fk_django_co; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_content_type_id_2f476e4b_fk_django_co FOREIGN KEY (content_type_id) REFERENCES public.django_content_type(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: authtoken_token authtoken_token_user_id_35299eff_fk_accounts_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authtoken_token
    ADD CONSTRAINT authtoken_token_user_id_35299eff_fk_accounts_user_id FOREIGN KEY (user_id) REFERENCES public.accounts_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: core_recyclebinitem core_recyclebinitem_content_type_id_f87b9c19_fk_django_co; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.core_recyclebinitem
    ADD CONSTRAINT core_recyclebinitem_content_type_id_f87b9c19_fk_django_co FOREIGN KEY (content_type_id) REFERENCES public.django_content_type(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: core_recyclebinitem core_recyclebinitem_deleted_by_id_73cc7883_fk_accounts_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.core_recyclebinitem
    ADD CONSTRAINT core_recyclebinitem_deleted_by_id_73cc7883_fk_accounts_user_id FOREIGN KEY (deleted_by_id) REFERENCES public.accounts_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: core_recyclebinitem core_recyclebinitem_restored_by_id_2ccd7e28_fk_accounts_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.core_recyclebinitem
    ADD CONSTRAINT core_recyclebinitem_restored_by_id_2ccd7e28_fk_accounts_user_id FOREIGN KEY (restored_by_id) REFERENCES public.accounts_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: divisions_division_leads divisions_division_l_division_id_0529c80f_fk_divisions; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.divisions_division_leads
    ADD CONSTRAINT divisions_division_l_division_id_0529c80f_fk_divisions FOREIGN KEY (division_id) REFERENCES public.divisions_division(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: divisions_division_leads divisions_division_leads_user_id_e5c33636_fk_accounts_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.divisions_division_leads
    ADD CONSTRAINT divisions_division_leads_user_id_e5c33636_fk_accounts_user_id FOREIGN KEY (user_id) REFERENCES public.accounts_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: divisions_educationprogramdetail divisions_educationp_created_by_id_27d523e7_fk_accounts_; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.divisions_educationprogramdetail
    ADD CONSTRAINT divisions_educationp_created_by_id_27d523e7_fk_accounts_ FOREIGN KEY (created_by_id) REFERENCES public.accounts_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: divisions_educationprogramdetail divisions_educationp_program_id_247df82c_fk_divisions; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.divisions_educationprogramdetail
    ADD CONSTRAINT divisions_educationp_program_id_247df82c_fk_divisions FOREIGN KEY (program_id) REFERENCES public.divisions_program(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: divisions_educationprogramdetail divisions_educationp_updated_by_id_4b7910f2_fk_accounts_; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.divisions_educationprogramdetail
    ADD CONSTRAINT divisions_educationp_updated_by_id_4b7910f2_fk_accounts_ FOREIGN KEY (updated_by_id) REFERENCES public.accounts_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: divisions_microfundprogramdetail divisions_microfundp_created_by_id_bed73eec_fk_accounts_; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.divisions_microfundprogramdetail
    ADD CONSTRAINT divisions_microfundp_created_by_id_bed73eec_fk_accounts_ FOREIGN KEY (created_by_id) REFERENCES public.accounts_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: divisions_microfundprogramdetail divisions_microfundp_program_id_af965baa_fk_divisions; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.divisions_microfundprogramdetail
    ADD CONSTRAINT divisions_microfundp_program_id_af965baa_fk_divisions FOREIGN KEY (program_id) REFERENCES public.divisions_program(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: divisions_microfundprogramdetail divisions_microfundp_updated_by_id_bd2f8346_fk_accounts_; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.divisions_microfundprogramdetail
    ADD CONSTRAINT divisions_microfundp_updated_by_id_bd2f8346_fk_accounts_ FOREIGN KEY (updated_by_id) REFERENCES public.accounts_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: divisions_program divisions_program_division_id_82095a01_fk_divisions_division_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.divisions_program
    ADD CONSTRAINT divisions_program_division_id_82095a01_fk_divisions_division_id FOREIGN KEY (division_id) REFERENCES public.divisions_division(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: divisions_program_maintainers divisions_program_ma_program_id_8a24a2b1_fk_divisions; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.divisions_program_maintainers
    ADD CONSTRAINT divisions_program_ma_program_id_8a24a2b1_fk_divisions FOREIGN KEY (program_id) REFERENCES public.divisions_program(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: divisions_program_maintainers divisions_program_ma_user_id_1b5f848b_fk_accounts_; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.divisions_program_maintainers
    ADD CONSTRAINT divisions_program_ma_user_id_1b5f848b_fk_accounts_ FOREIGN KEY (user_id) REFERENCES public.accounts_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: divisions_rescueprogramdetail divisions_rescueprog_created_by_id_e97050ac_fk_accounts_; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.divisions_rescueprogramdetail
    ADD CONSTRAINT divisions_rescueprog_created_by_id_e97050ac_fk_accounts_ FOREIGN KEY (created_by_id) REFERENCES public.accounts_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: divisions_rescueprogramdetail divisions_rescueprog_program_id_4e745372_fk_divisions; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.divisions_rescueprogramdetail
    ADD CONSTRAINT divisions_rescueprog_program_id_4e745372_fk_divisions FOREIGN KEY (program_id) REFERENCES public.divisions_program(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: divisions_rescueprogramdetail divisions_rescueprog_updated_by_id_ac48ca74_fk_accounts_; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.divisions_rescueprogramdetail
    ADD CONSTRAINT divisions_rescueprog_updated_by_id_ac48ca74_fk_accounts_ FOREIGN KEY (updated_by_id) REFERENCES public.accounts_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: divisions_vocationaltrainingprogramtrainerdetail divisions_vocational_created_by_id_0a1f07ed_fk_accounts_; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.divisions_vocationaltrainingprogramtrainerdetail
    ADD CONSTRAINT divisions_vocational_created_by_id_0a1f07ed_fk_accounts_ FOREIGN KEY (created_by_id) REFERENCES public.accounts_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: divisions_vocationaltrainingprogramtraineedetail divisions_vocational_created_by_id_79604231_fk_accounts_; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.divisions_vocationaltrainingprogramtraineedetail
    ADD CONSTRAINT divisions_vocational_created_by_id_79604231_fk_accounts_ FOREIGN KEY (created_by_id) REFERENCES public.accounts_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: divisions_vocationaltrainingprogramtrainerdetail divisions_vocational_program_id_ecf2f2f2_fk_divisions; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.divisions_vocationaltrainingprogramtrainerdetail
    ADD CONSTRAINT divisions_vocational_program_id_ecf2f2f2_fk_divisions FOREIGN KEY (program_id) REFERENCES public.divisions_program(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: divisions_vocationaltrainingprogramtraineedetail divisions_vocational_trainer_id_d756f924_fk_divisions; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.divisions_vocationaltrainingprogramtraineedetail
    ADD CONSTRAINT divisions_vocational_trainer_id_d756f924_fk_divisions FOREIGN KEY (trainer_id) REFERENCES public.divisions_vocationaltrainingprogramtrainerdetail(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: divisions_vocationaltrainingprogramtrainerdetail divisions_vocational_updated_by_id_6993a9b8_fk_accounts_; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.divisions_vocationaltrainingprogramtrainerdetail
    ADD CONSTRAINT divisions_vocational_updated_by_id_6993a9b8_fk_accounts_ FOREIGN KEY (updated_by_id) REFERENCES public.accounts_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: divisions_vocationaltrainingprogramtraineedetail divisions_vocational_updated_by_id_7c271473_fk_accounts_; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.divisions_vocationaltrainingprogramtraineedetail
    ADD CONSTRAINT divisions_vocational_updated_by_id_7c271473_fk_accounts_ FOREIGN KEY (updated_by_id) REFERENCES public.accounts_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: django_admin_log django_admin_log_content_type_id_c4bce8eb_fk_django_co; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_content_type_id_c4bce8eb_fk_django_co FOREIGN KEY (content_type_id) REFERENCES public.django_content_type(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: django_admin_log django_admin_log_user_id_c564eba6_fk_accounts_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_user_id_c564eba6_fk_accounts_user_id FOREIGN KEY (user_id) REFERENCES public.accounts_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: django_celery_beat_periodictask django_celery_beat_p_clocked_id_47a69f82_fk_django_ce; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_celery_beat_periodictask
    ADD CONSTRAINT django_celery_beat_p_clocked_id_47a69f82_fk_django_ce FOREIGN KEY (clocked_id) REFERENCES public.django_celery_beat_clockedschedule(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: django_celery_beat_periodictask django_celery_beat_p_crontab_id_d3cba168_fk_django_ce; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_celery_beat_periodictask
    ADD CONSTRAINT django_celery_beat_p_crontab_id_d3cba168_fk_django_ce FOREIGN KEY (crontab_id) REFERENCES public.django_celery_beat_crontabschedule(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: django_celery_beat_periodictask django_celery_beat_p_interval_id_a8ca27da_fk_django_ce; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_celery_beat_periodictask
    ADD CONSTRAINT django_celery_beat_p_interval_id_a8ca27da_fk_django_ce FOREIGN KEY (interval_id) REFERENCES public.django_celery_beat_intervalschedule(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: django_celery_beat_periodictask django_celery_beat_p_solar_id_a87ce72c_fk_django_ce; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_celery_beat_periodictask
    ADD CONSTRAINT django_celery_beat_p_solar_id_a87ce72c_fk_django_ce FOREIGN KEY (solar_id) REFERENCES public.django_celery_beat_solarschedule(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: documents_bankstatementaccessrequest documents_bankstatem_document_id_db16dfa1_fk_documents; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.documents_bankstatementaccessrequest
    ADD CONSTRAINT documents_bankstatem_document_id_db16dfa1_fk_documents FOREIGN KEY (document_id) REFERENCES public.documents_document(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: documents_bankstatementaccessrequest documents_bankstatem_user_id_db88bc28_fk_accounts_; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.documents_bankstatementaccessrequest
    ADD CONSTRAINT documents_bankstatem_user_id_db88bc28_fk_accounts_ FOREIGN KEY (user_id) REFERENCES public.accounts_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: email_templates_emailtemplates email_templates_emai_created_by_id_801c5250_fk_accounts_; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_templates_emailtemplates
    ADD CONSTRAINT email_templates_emai_created_by_id_801c5250_fk_accounts_ FOREIGN KEY (created_by_id) REFERENCES public.accounts_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: email_templates_emailtemplates email_templates_emai_updated_by_id_1c57885f_fk_accounts_; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_templates_emailtemplates
    ADD CONSTRAINT email_templates_emai_updated_by_id_1c57885f_fk_accounts_ FOREIGN KEY (updated_by_id) REFERENCES public.accounts_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: grants_grant grants_grant_program_id_8d75710a_fk_divisions_program_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grants_grant
    ADD CONSTRAINT grants_grant_program_id_8d75710a_fk_divisions_program_id FOREIGN KEY (program_id) REFERENCES public.divisions_program(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: grants_grant_required_documents grants_grant_require_document_id_75244ebb_fk_documents; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grants_grant_required_documents
    ADD CONSTRAINT grants_grant_require_document_id_75244ebb_fk_documents FOREIGN KEY (document_id) REFERENCES public.documents_document(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: grants_grant_required_documents grants_grant_require_grant_id_125e5d91_fk_grants_gr; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grants_grant_required_documents
    ADD CONSTRAINT grants_grant_require_grant_id_125e5d91_fk_grants_gr FOREIGN KEY (grant_id) REFERENCES public.grants_grant(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: grants_grant_submitted_documents grants_grant_submitt_document_id_a248f8a0_fk_documents; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grants_grant_submitted_documents
    ADD CONSTRAINT grants_grant_submitt_document_id_a248f8a0_fk_documents FOREIGN KEY (document_id) REFERENCES public.documents_document(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: grants_grant_submitted_documents grants_grant_submitt_grant_id_6e327786_fk_grants_gr; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grants_grant_submitted_documents
    ADD CONSTRAINT grants_grant_submitt_grant_id_6e327786_fk_grants_gr FOREIGN KEY (grant_id) REFERENCES public.grants_grant(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: grants_grant grants_grant_submitted_by_id_fabea75b_fk_accounts_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grants_grant
    ADD CONSTRAINT grants_grant_submitted_by_id_fabea75b_fk_accounts_user_id FOREIGN KEY (submitted_by_id) REFERENCES public.accounts_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: grants_grantexpenditure grants_grantexpenditure_grant_id_7175f8ac_fk_grants_grant_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grants_grantexpenditure
    ADD CONSTRAINT grants_grantexpenditure_grant_id_7175f8ac_fk_grants_grant_id FOREIGN KEY (grant_id) REFERENCES public.grants_grant(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: notifications_notification notifications_notifi_assigner_id_9af7d917_fk_accounts_; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications_notification
    ADD CONSTRAINT notifications_notifi_assigner_id_9af7d917_fk_accounts_ FOREIGN KEY (assigner_id) REFERENCES public.accounts_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: notifications_notification notifications_notifi_recipient_id_d055f3f0_fk_accounts_; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications_notification
    ADD CONSTRAINT notifications_notifi_recipient_id_d055f3f0_fk_accounts_ FOREIGN KEY (recipient_id) REFERENCES public.accounts_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: task_manager_task task_manager_task_assigned_by_id_94ddebb1_fk_accounts_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.task_manager_task
    ADD CONSTRAINT task_manager_task_assigned_by_id_94ddebb1_fk_accounts_user_id FOREIGN KEY (assigned_by_id) REFERENCES public.accounts_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: task_manager_task task_manager_task_assigned_to_id_aaf7f5f9_fk_accounts_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.task_manager_task
    ADD CONSTRAINT task_manager_task_assigned_to_id_aaf7f5f9_fk_accounts_user_id FOREIGN KEY (assigned_to_id) REFERENCES public.accounts_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: task_manager_task task_manager_task_grant_id_5dd5c3dd_fk_grants_grant_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.task_manager_task
    ADD CONSTRAINT task_manager_task_grant_id_5dd5c3dd_fk_grants_grant_id FOREIGN KEY (grant_id) REFERENCES public.grants_grant(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: token_blacklist_blacklistedtoken token_blacklist_blacklistedtoken_token_id_3cc7fe56_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.token_blacklist_blacklistedtoken
    ADD CONSTRAINT token_blacklist_blacklistedtoken_token_id_3cc7fe56_fk FOREIGN KEY (token_id) REFERENCES public.token_blacklist_outstandingtoken(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: token_blacklist_outstandingtoken token_blacklist_outs_user_id_83bc629a_fk_accounts_; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.token_blacklist_outstandingtoken
    ADD CONSTRAINT token_blacklist_outs_user_id_83bc629a_fk_accounts_ FOREIGN KEY (user_id) REFERENCES public.accounts_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- PostgreSQL database dump complete
--

