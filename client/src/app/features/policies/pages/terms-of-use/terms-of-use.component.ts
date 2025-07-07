import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MetadataService } from '../../../../core/services/metadata-service';
import { Language } from '../../../../core/enums/language.enum';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-terms-of-use-page',
  imports: [MarkdownModule, TranslateModule],
  templateUrl: './terms-of-use.component.html',
  styleUrls: ['./terms-of-use.component.scss', '../../styles/policy.style.scss']
})
export class TermsOfUse {
  termsOfUseEn: string = `
  ## ACCEPTANCE OF TERMS
  Welcome to VSS (“we,” “our,” or “us”). By accessing or using our website and services, you accept and agree to be bound by these Terms, our Privacy Policy, and any other legal notices or guidelines posted on the Site. If you do not agree with any part of these Terms, you must not use our services.

  ## DESCRIPTION OF SERVICE
  VSS provides tools and resources for individuals looking to form companies in Canada, including but not limited to company registration, compliance assistance, and business consultation.

  ## USER RESPONSIBILITIES
  - **Eligibility:** You must be at least 18 years of age to use our Service.
  - **Account Information:** You agree to provide accurate, current, and complete information during the registration process and to update such information as necessary.
  - **Compliance:** You are responsible for ensuring that your use of our Service complies with all applicable laws and regulations.

  ## PROHIBITED ACTIVITIES
  You agree not to:
  - Use the Service for any illegal or unauthorized purpose.
  - Interfere with or disrupt the Service or servers/network connected to the Service.
  - Transmit any code of a destructive nature.
  - Use any data mining, robots, or similar data gathering and extraction tools.

  ## FEES AND PAYMENT
  Some features of our Service may require payment of fees. All fees are in Canadian dollars and are non-refundable unless otherwise specified.

  ## INTELLECTUAL PROPERTY
  All content provided on the Site (e.g., text, graphics, logos, images, software) is the property of VSS or its licensors and is protected by applicable intellectual property laws. You may not copy, modify, distribute, or sell any content without our prior written consent.

  ## DISCLAIMER OF WARRANTIES
  The Service is provided on an "as-is" and "as-available" basis. We disclaim all warranties, express or implied, including the warranties of merchantability, fitness for a particular purpose, and non-infringement.

  ## LIMITATION OF LIABILITY
  To the maximum extent permitted by law, VSS shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, arising out of or in connection with your use or inability to use the Service.

  ## INDEMNIFICATION
  You agree to indemnify and hold VSS harmless from any claims, losses, damages, liabilities, including legal fees, arising out of your use or misuse of the Service, violation of these Terms, or violation of any rights of a third party.

  ## TERMINATION
  We reserve the right to terminate your access to the Service at any time, with or without cause or notice.

  ## ENGLISH AND FRENCH LANGUAGE
  In case of discrepancies between the English and French versions of this Policy, the French version prevails.

  ## MEDIATION AND ARBITRATION
  Disputes regarding this Policy will be resolved through mediation or arbitration.

  ## APPLICABLE LAW AND JURISDICTION
  This Policy is governed by the laws of Quebec and Canada, with disputes subject to the jurisdiction of Quebec courts.

  ## MODIFICATION OF THIS POLICY
  VSS reserves the right to modify or supplement this Policy, with users notified of any changes. Users have the option to terminate their contract if they do not agree with policy changes.

  For any inquiries regarding this Policy or the handling of personal information, please contact us at contact@vsslabs.com.
  `;

  termsOfUseFr: string = `
  ## ACCEPTATION DES CONDITIONS
  Bienvenue sur le site de VSS (« nous », « notre » ou « nos »). En accédant à notre site web et à nos services ou en les utilisant, vous acceptez d'être lié par les présentes Conditions, par notre Politique de confidentialité et par tout autre avis juridique ou directive publié sur le Site. Si vous n'êtes pas d'accord avec une partie de ces conditions, vous ne devez pas utiliser nos services.

  ## DESCRIPTION DU SERVICE
  VSS fournit des outils et des ressources aux personnes qui cherchent à créer des entreprises au Canada, y compris, mais sans s'y limiter, l'enregistrement d'une entreprise, l'aide à la conformité et la consultation commerciale.

  ## RESPONSABILITÉS DE L'UTILISATEUR
  - **Admissibilité:** Vous devez être âgé d'au moins 18 ans pour utiliser notre service.
  - **Informations sur le compte:** Vous acceptez de fournir des informations exactes, à jour et complètes au cours du processus d'enregistrement et de mettre à jour ces informations si nécessaire.
  - **Conformité:** Vous êtes responsable de vous assurer que votre utilisation de notre service est conforme à toutes les lois et réglementations en vigueur.

  ## ACTIVITÉS INTERDITES
  Vous vous engagez à ne pas :
  - Utiliser le service à des fins illégales ou non autorisées.
  - Interférer ou perturber le service ou les serveurs/réseaux connectés au service.
  - Transmettre tout code de nature destructive.
  - Utiliser des outils d'exploration de données, des robots ou des outils similaires de collecte et d'extraction de données.

  ## FRAIS ET PAIEMENT
  Certaines fonctionnalités de notre service peuvent nécessiter le paiement de frais. Tous les frais sont exprimés en dollars canadiens et ne sont pas remboursables, sauf indication contraire.

  ## PROPRIÉTÉ INTELLECTUELLE
  Tout le contenu fourni sur le Site (par exemple, le texte, les graphiques, les logos, les images, les logiciels) est la propriété de VSS ou de ses concédants de licence et est protégé par les lois applicables en matière de propriété intellectuelle. Il est interdit de copier, modifier, distribuer ou vendre tout contenu sans notre accord écrit préalable.

  ## EXCLUSION DE GARANTIE
  Le service est fourni « en l'état » et « selon la disponibilité ». Nous déclinons toute garantie, expresse ou implicite, y compris les garanties de qualité marchande, d'adéquation à un usage particulier et d'absence de contrefaçon.

  ## LIMITATION DE LA RESPONSABILITÉ
  Dans les limites autorisées par la loi, VSS ne sera pas responsable des dommages indirects, accessoires, spéciaux, consécutifs ou punitifs, ou de toute perte de profits ou de revenus, découlant de ou en rapport avec votre utilisation ou votre incapacité à utiliser le Service.

  ## INDEMNISATION
  Vous acceptez d'indemniser et de dégager VSS de toute responsabilité en cas de réclamations, pertes, dommages, responsabilités, y compris les frais de justice, résultant de votre utilisation ou mauvaise utilisation du Service, de la violation des présentes Conditions, ou de la violation de tout droit d'un tiers.

  ## RÉSILIATION
  Nous nous réservons le droit de mettre fin à votre accès au Service à tout moment, avec ou sans motif ou préavis.

  ## LANGUE ANGLAISE ET FRANÇAISE
  En cas de divergences entre les versions anglaise et française de cette Politique, la version française prévaut.
  
  ## MÉDIATION ET ARBITRAGE
  Les litiges concernant cette Politique seront résolus par médiation ou arbitrage.
  
  ## LOI APPLICABLE ET JURIDICTION
  Cette Politique est régie par les lois du Québec et du Canada, les litiges étant soumis à la compétence des tribunaux du Québec.
  
  ## MODIFICATION DE CETTE POLITIQUE
  VSS se réserve le droit de modifier ou de compléter cette Politique, les utilisateurs étant informés de tout changement. Les utilisateurs ont la possibilité de résilier leur contrat s'ils ne sont pas d'accord avec les modifications de la politique.
  
  Pour toute question concernant cette Politique ou le traitement des informations personnelles, veuillez nous contacter à contact@vsslabs.com.
  `;

  get termsOfUse(): string {
    switch (this.translateService.currentLang) {
      case Language.ENGLISH:
        return this.termsOfUseEn;
      case Language.FRENCH:
        return this.termsOfUseFr;
      default:
        return this.termsOfUseEn;
    }
  }

  constructor(
    private translateService: TranslateService,
    private metadataService: MetadataService,
  ) {
  }

  ngOnInit(): void {
    this.metadataService.setPageMetadata('pages.termsOfUse.meta');
  }
}
