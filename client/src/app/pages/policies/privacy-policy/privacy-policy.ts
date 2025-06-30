import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MetadataService } from '../../../services/general/metadata-service';
import { Language } from '../../../enums/language';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-privacy-policy-page',
  imports: [MarkdownModule, TranslateModule],
  templateUrl: './privacy-policy.html',
  styleUrls: ['./privacy-policy.scss', '../../page.scss']
})
export class PrivacyPolicy {
  privacyPolicyEn: string = `
  ## INTRODUCTION
  VSS is dedicated to safeguarding the privacy of personal information in today's digital landscape. We prioritize the protection of your privacy and are committed to upholding the confidentiality of the information we collect.

  This Privacy Policy (hereinafter referred to as the "Policy") outlines our commitment to adhering to applicable laws and regulations governing the collection and processing of personal information. By utilizing our services, you agree to the terms outlined in this Policy.

  ## SCOPE OF THE POLICY
  At VSS, we collect personal information to facilitate our services and maintain our relationship with users. We pledge to use this information only in accordance with this Policy and applicable laws.

  ## COLLECTION OF PERSONAL INFORMATION
  Personal information collected by VSS is utilized to provide services, legal resources, and information to our users. We may collect information such as name, contact details, and browsing history to enhance user experience and administer customer accounts.

  We ensure that your personal information is collected with your consent, and you have the right to withdraw this consent at any time. Additionally, we respect the privacy of individuals under the age of eighteen (18) and do not knowingly collect their personal information.

  ## FORMS AND INTERACTIONS
  We collect personal information through various forms on our platform, including legal resource downloads, order forms, account creation forms, and appointment forms. This information is collected directly from users to facilitate the provision of our services.

  ## PROTECTION AGAINST FRAUD AND THEFT OF PERSONAL INFORMATION
  VSS implements measures to prevent fraud and theft of personal information, adhering to relevant laws and regulations. While we take precautions to safeguard personal information, we cannot guarantee absolute security.

  ## DATA EXCHANGED AUTOMATICALLY
  We may collect information automatically through cookies or similar technologies to improve user experience and analyze platform usage. Users have the option to manage cookie preferences, although this may affect certain features of the platform.

  ## INTERNATIONAL COMMUNICATIONS
  In certain circumstances, user data may be transferred to servers located outside of Canada. By using our services, users acknowledge and release VSS from any responsibility regarding such transfers.

  ## SHARING OF PERSONAL INFORMATION
  VSS does not commercialize personal information without user consent, except in cases of business transfer. We may share personal information with third-party service providers to facilitate service delivery, with user consent.

  ## RIGHT OF OPPOSITION AND WITHDRAWAL
  Users have the right to object to the use of their personal information for specific purposes and to withdraw consent. Additionally, users can request access to and correction of their personal information by contacting us.

  ## SECURITY
  VSS maintains the confidentiality and security of personal information through various measures, including secure protocols, access management, and encryption. While we strive to ensure security, users should be aware of inherent risks associated with internet transmission.

  ## ENGLISH AND FRENCH LANGUAGE
  In case of discrepancies between the English and French versions of this Policy, the French version prevails.

  ## MEDIATION AND ARBITRATION
  Disputes regarding this Policy will be resolved through mediation or arbitration.

  ## APPLICABLE LAW AND JURISDICTION
  This Policy is governed by the laws of Quebec and Canada, with disputes subject to the jurisdiction of Quebec courts.

  ## MODIFICATION OF THIS POLICY
  VSS reserves the right to modify or supplement this Policy, with users notified of any changes. Users have the option to terminate their contract if they do not agree with policy changes.

  For any inquiries regarding this Policy or the handling of personal information, please contact us at contact@VSSlabs.com.
  `;

  privacyPolicyFr = `
  ## INTRODUCTION
  VSS s'engage à protéger la confidentialité des informations personnelles dans le paysage numérique d'aujourd'hui. Nous accordons la plus haute importance à la protection de votre vie privée et nous nous engageons à respecter la confidentialité des informations que nous recueillons.

  Cette politique de confidentialité (ci-après dénommée "Politique") décrit notre engagement à respecter les lois et réglementations applicables régissant la collecte et le traitement des informations personnelles. En utilisant nos services, vous acceptez les termes énoncés dans cette Politique.

  ## PORTÉE DE LA POLITIQUE
  Chez VSS, nous collectons des informations personnelles pour faciliter nos services et maintenir notre relation avec les utilisateurs. Nous nous engageons à utiliser ces informations uniquement conformément à cette Politique et aux lois applicables.

  ## COLLECTE DES INFORMATIONS PERSONNELLES
  Les informations personnelles collectées par VSS sont utilisées pour fournir des services, des ressources juridiques et des informations à nos utilisateurs. Nous pouvons collecter des informations telles que le nom, les coordonnées et l'historique de navigation pour améliorer l'expérience utilisateur et administrer les comptes clients.

  Nous veillons à ce que vos informations personnelles soient collectées avec votre consentement, et vous avez le droit de retirer ce consentement à tout moment. De plus, nous respectons la vie privée des personnes de moins de dix-huit (18) ans et ne collectons pas délibérément leurs informations personnelles.

  ## FORMULAIRES ET INTERACTIONS
  Nous collectons des informations personnelles via divers formulaires sur notre plateforme, notamment des téléchargements de ressources juridiques, des formulaires de commande, des formulaires de création de compte et des formulaires de rendez-vous. Ces informations sont collectées directement auprès des utilisateurs pour faciliter la fourniture de nos services.

  ## PROTECTION CONTRE LA FRAUDE ET LE VOL D'INFORMATIONS PERSONNELLES
  VSS met en place des mesures pour prévenir la fraude et le vol d'informations personnelles, en respectant les lois et réglementations pertinentes. Bien que nous prenions des précautions pour protéger les informations personnelles, nous ne pouvons garantir une sécurité absolue.

  ## ÉCHANGES DE DONNÉES AUTOMATIQUES
  Nous pouvons collecter des informations automatiquement via des cookies ou des technologies similaires pour améliorer l'expérience utilisateur et analyser l'utilisation de la plateforme. Les utilisateurs ont la possibilité de gérer les préférences en matière de cookies, bien que cela puisse affecter certaines fonctionnalités de la plateforme.

  ## COMMUNICATIONS INTERNATIONALES
  Dans certaines circonstances, les données utilisateur peuvent être transférées vers des serveurs situés à l'extérieur du Canada. En utilisant nos services, les utilisateurs reconnaissent et dégagent VSS de toute responsabilité concernant de tels transferts.

  ## PARTAGE DES INFORMATIONS PERSONNELLES
  VSS ne commercialise pas les informations personnelles sans le consentement de l'utilisateur, sauf en cas de transfert d'entreprise. Nous pouvons partager des informations personnelles avec des prestataires de services tiers pour faciliter la prestation de services, avec le consentement de l'utilisateur.

  ## DROIT D'OPPOSITION ET DE RETRAIT
  Les utilisateurs ont le droit de s'opposer à l'utilisation de leurs informations personnelles à des fins spécifiques et de retirer leur consentement. De plus, les utilisateurs peuvent demander l'accès et la correction de leurs informations personnelles en nous contactant.

  ## SÉCURITÉ
  VSS maintient la confidentialité et la sécurité des informations personnelles grâce à diverses mesures, notamment des protocoles sécurisés, une gestion des accès et un cryptage. Bien que nous nous efforcions de garantir la sécurité, les utilisateurs doivent être conscients des risques inhérents à la transmission sur Internet.

  ## LANGUE ANGLAISE ET FRANÇAISE
  En cas de divergences entre les versions anglaise et française de cette Politique, la version française prévaut.

  ## MÉDIATION ET ARBITRAGE
  Les litiges concernant cette Politique seront résolus par médiation ou arbitrage.

  ## LOI APPLICABLE ET JURIDICTION
  Cette Politique est régie par les lois du Québec et du Canada, les litiges étant soumis à la compétence des tribunaux du Québec.

  ## MODIFICATION DE CETTE POLITIQUE
  VSS se réserve le droit de modifier ou de compléter cette Politique, les utilisateurs étant informés de tout changement. Les utilisateurs ont la possibilité de résilier leur contrat s'ils ne sont pas d'accord avec les modifications de la politique.

  Pour toute question concernant cette Politique ou le traitement des informations personnelles, veuillez nous contacter à contact@VSSlabs.com.
  `;

  get privacyPolicy(): string {
    switch (this.translateService.currentLang) {
      case Language.English:
        return this.privacyPolicyEn;
      case Language.French:
        return this.privacyPolicyFr;
      default:
        return this.privacyPolicyEn;
    }
  }

  constructor(
    private translateService: TranslateService,
    private metadataService: MetadataService,
  ) {
  }

  ngOnInit(): void {
    this.metadataService.setPageMetadata('pages.privacyPolicy.meta');
  }
}
