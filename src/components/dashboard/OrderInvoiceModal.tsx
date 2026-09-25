import React, { useRef } from 'react';
import {
  Printer,
  Download,
  X,
  Crown,
  Truck,
  CheckCircle2,
  Calendar,
  Building2,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Package,
  CreditCard,
  Banknote
} from 'lucide-react';
import { Order, Language } from '../../types';
import { formatDA, BOUTIQUE_PHONE } from '../../lib/i18n';

interface OrderInvoiceModalProps {
  order: Order | null;
  language: Language;
  onClose: () => void;
}

export const OrderInvoiceModal: React.FC<OrderInvoiceModalProps> = ({
  order,
  language,
  onClose,
}) => {
  const invoicePaperRef = useRef<HTMLDivElement>(null);

  if (!order) return null;

  const invoiceNumber = `FAC-${order.id.replace(/^DZ-?/, '')}`;
  const orderDate = new Date(order.createdAt).toLocaleDateString(
    language === 'ar' ? 'ar-DZ' : 'fr-FR',
    {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }
  );

  const phone = order.phone || (order as any).customerPhone || '0550 12 34 56';
  const deliveryFee = order.deliveryFee ?? 500;
  const subtotal =
    order.subtotal ??
    (order.items && order.items.length > 0
      ? order.items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0)
      : order.total - deliveryFee);
  const total = order.total;
  const discount = order.discount ?? 0;

  // Generate printable standalone HTML
  const generateInvoiceHtml = () => {
    const isDesk = order.deliveryMethod === 'desk';
    const deliveryMethodLabel = isDesk
      ? 'Bureau Stop Desk (Yalidine Express)'
      : 'Livraison à Domicile (Yalidine Express)';

    const paymentLabel =
      order.paymentMethod === 'baridimob'
        ? 'Règlement BaridiMob / CCP validé'
        : order.paymentMethod === 'bank_transfer'
        ? 'Virement Bancaire / Carte CIB'
        : order.paymentMethod === 'edahabia' || order.paymentMethod === 'cib'
        ? 'Paiement électronique par carte'
        : 'Paiement en espèces à la livraison (COD - 58 Wilayas)';

    const itemsRows = (order.items || [])
      .map(
        (item, idx) => `
        <tr style="border-bottom: 1px solid #EAE4DC;">
          <td style="padding: 12px 14px; font-weight: 500; color: #1A1918;">
            <div style="font-weight: 600;">${item.productName}</div>
            <div style="font-size: 11px; color: #78716C; margin-top: 2px;">
              Taille: ${item.size || 'Unique'} · Couleur: ${item.color || 'Standard'}
            </div>
          </td>
          <td style="padding: 12px 14px; text-align: center; color: #44403C; font-weight: 500;">
            ${item.quantity}
          </td>
          <td style="padding: 12px 14px; text-align: right; color: #44403C; font-family: monospace; font-size: 12px;">
            ${item.unitPrice.toLocaleString('fr-DZ')} DA
          </td>
          <td style="padding: 12px 14px; text-align: right; font-weight: 700; color: #1A1918; font-family: monospace; font-size: 12px;">
            ${(item.quantity * item.unitPrice).toLocaleString('fr-DZ')} DA
          </td>
        </tr>
      `
      )
      .join('');

    return `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="utf-8" />
        <title>Facture ZAYA - ${order.id}</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 12mm 14mm;
          }
          * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #1A1918;
            background: #ffffff;
            margin: 0;
            padding: 0;
            font-size: 12px;
            line-height: 1.45;
          }
          .invoice-box {
            max-width: 800px;
            margin: auto;
            padding: 24px;
            background: #ffffff;
          }
          .header-bar {
            height: 4px;
            background: linear-gradient(90deg, #1A1918 0%, #C5A880 50%, #1A1918 100%);
            margin-bottom: 24px;
          }
          .brand-title {
            font-family: Georgia, serif;
            font-size: 26px;
            letter-spacing: 0.25em;
            font-weight: 700;
            color: #1A1918;
            margin: 0;
            text-transform: uppercase;
          }
          .brand-subtitle {
            font-size: 9px;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            color: #A66C44;
            font-weight: 600;
            margin-top: 3px;
          }
          .meta-box {
            background: #FAF8F5;
            border: 1px solid #EAE4DC;
            border-radius: 8px;
            padding: 12px 16px;
          }
          .table-header {
            background: #F4EFEA;
            border-top: 1px solid #DDD5CA;
            border-bottom: 1px solid #DDD5CA;
            text-transform: uppercase;
            font-size: 10px;
            letter-spacing: 0.08em;
            color: #57534E;
            font-weight: 700;
          }
          .badge {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
          }
          .stamp-box {
            border: 2px dashed #C5A880;
            border-radius: 8px;
            padding: 10px 14px;
            display: inline-block;
            text-align: center;
            background: #FFFDF9;
            color: #8C6239;
          }
        </style>
      </head>
      <body>
        <div class="invoice-box">
          <div class="header-bar"></div>

          <!-- Header -->
          <table style="width: 100%; margin-bottom: 24px;">
            <tr>
              <td style="vertical-align: top; width: 55%;">
                <h1 class="brand-title">ZAYA</h1>
                <div class="brand-subtitle">Haute Couture & Atelier Privé Alger</div>
                <div style="font-size: 11px; color: #78716C; margin-top: 8px; line-height: 1.5;">
                  14 Rue Didouche Mourad, Alger-Centre<br />
                  Résidence Les Pins, Sidi Yahia, Hydra, Alger<br />
                  RC: 16/00-098234B22 · NIF: 002216098234120<br />
                  Service Concierge: +213 550 12 34 56 · contact@zaya-atelier.dz
                </div>
              </td>
              <td style="vertical-align: top; width: 45%; text-align: right;">
                <div class="meta-box" style="display: inline-block; text-align: left; width: 100%;">
                  <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #78716C; font-weight: 700;">
                    FACTURE OFFICIELLE D'ACHAT
                  </div>
                  <div style="font-family: monospace; font-size: 15px; font-weight: 700; color: #1A1918; margin: 4px 0;">
                    N° ${invoiceNumber}
                  </div>
                  <div style="font-size: 11px; color: #57534E;">
                    <strong>Date :</strong> ${orderDate}<br />
                    <strong>Réf Commande :</strong> #${order.id}<br />
                    <strong>Expédition :</strong> Yalidine Express (58 Wilayas)
                  </div>
                </div>
              </td>
            </tr>
          </table>

          <!-- Client & Delivery Section -->
          <table style="width: 100%; margin-bottom: 24px; border-collapse: separate; border-spacing: 12px 0;">
            <tr>
              <td style="width: 50%; vertical-align: top; background: #FAF8F5; border: 1px solid #EAE4DC; border-radius: 8px; padding: 14px;">
                <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700; color: #8C6239; margin-bottom: 6px;">
                  Facturé à (Client)
                </div>
                <div style="font-size: 13px; font-weight: 700; color: #1A1918; margin-bottom: 4px;">
                  ${order.customerName}
                </div>
                <div style="font-size: 11px; color: #57534E; line-height: 1.5;">
                  <strong>Téléphone :</strong> ${phone}<br />
                  <strong>E-mail :</strong> ${order.customerName.toLowerCase().replace(/\s+/g, '.')}@client.dz<br />
                  <strong>Région :</strong> Wilaya de ${order.wilayaName} (${String(order.wilayaCode).padStart(2, '0')})
                </div>
              </td>

              <td style="width: 50%; vertical-align: top; background: #FAF8F5; border: 1px solid #EAE4DC; border-radius: 8px; padding: 14px;">
                <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700; color: #8C6239; margin-bottom: 6px;">
                  Adresse de Livraison & Expédition
                </div>
                <div style="font-size: 13px; font-weight: 700; color: #1A1918; margin-bottom: 4px;">
                  ${deliveryMethodLabel}
                </div>
                <div style="font-size: 11px; color: #57534E; line-height: 1.5;">
                  <strong>Adresse :</strong> ${order.address || 'Adresse indiquée à la commande'}<br />
                  <strong>Commune :</strong> ${order.commune}<br />
                  <strong>Wilaya :</strong> ${order.wilayaName} (${String(order.wilayaCode).padStart(2, '0')})
                </div>
              </td>
            </tr>
          </table>

          <!-- Items Table -->
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr class="table-header">
                <th style="padding: 10px 14px; text-align: left;">Désignation des Articles</th>
                <th style="padding: 10px 14px; text-align: center; width: 60px;">Qté</th>
                <th style="padding: 10px 14px; text-align: right; width: 120px;">Prix Unit.</th>
                <th style="padding: 10px 14px; text-align: right; width: 130px;">Total (DA)</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRows}
            </tbody>
          </table>

          <!-- Totals Breakdown & Atelier Seal -->
          <table style="width: 100%; margin-bottom: 24px;">
            <tr>
              <td style="vertical-align: top; width: 50%;">
                <div class="stamp-box">
                  <div style="font-size: 9px; font-weight: 800; letter-spacing: 0.15em; text-transform: uppercase;">
                    ★ ATELIER ZAYA HAUTE COUTURE ★
                  </div>
                  <div style="font-size: 11px; font-weight: 700; color: #1A1918; margin: 3px 0;">
                    CERTIFIÉ CONFORME & AUTHENTIQUE
                  </div>
                  <div style="font-size: 9px; color: #78716C;">
                    Contrôle Qualité Validé · Expédition 58 Wilayas
                  </div>
                </div>

                <div style="margin-top: 14px; font-size: 10px; color: #78716C; line-height: 1.5; max-width: 320px;">
                  <strong>Modalités de paiement :</strong> ${paymentLabel}.<br />
                  Garantie d'échange de taille assurée sous 48h après réception auprès du Concierge.
                </div>
              </td>

              <td style="vertical-align: top; width: 50%;">
                <table style="width: 100%; border-collapse: collapse; background: #FAF8F5; border: 1px solid #EAE4DC; border-radius: 8px;">
                  <tr>
                    <td style="padding: 8px 14px; font-size: 11px; color: #57534E;">Sous-total articles :</td>
                    <td style="padding: 8px 14px; text-align: right; font-family: monospace; font-size: 11px; color: #1A1918;">
                      ${subtotal.toLocaleString('fr-DZ')} DA
                    </td>
                  </tr>
                  ${
                    discount > 0
                      ? `
                  <tr>
                    <td style="padding: 8px 14px; font-size: 11px; color: #047857;">Remise privilège :</td>
                    <td style="padding: 8px 14px; text-align: right; font-family: monospace; font-size: 11px; color: #047857; font-weight: 700;">
                      -${discount.toLocaleString('fr-DZ')} DA
                    </td>
                  </tr>`
                      : ''
                  }
                  <tr>
                    <td style="padding: 8px 14px; font-size: 11px; color: #57534E;">
                      Frais d'expédition (${order.wilayaName}) :
                    </td>
                    <td style="padding: 8px 14px; text-align: right; font-family: monospace; font-size: 11px; color: #1A1918;">
                      ${deliveryFee === 0 ? 'Gratuit' : `${deliveryFee.toLocaleString('fr-DZ')} DA`}
                    </td>
                  </tr>
                  <tr style="border-top: 2px solid #EAE4DC; background: #F4EFEA;">
                    <td style="padding: 12px 14px; font-size: 12px; font-weight: 800; color: #1A1918; text-transform: uppercase;">
                      Total Net à Régler :
                    </td>
                    <td style="padding: 12px 14px; text-align: right; font-family: monospace; font-size: 15px; font-weight: 800; color: #1A1918;">
                      ${total.toLocaleString('fr-DZ')} DA
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <!-- Footer Legal -->
          <div style="border-top: 1px solid #EAE4DC; padding-top: 14px; text-align: center; font-size: 10px; color: #78716C; line-height: 1.6;">
            Maison ZAYA Atelier Privé · SARL au capital de 10 000 000 DZD · Registre du Commerce d'Alger N° 16/00-098234B22<br />
            Document officiel tenant lieu de bon de livraison et facture de vente au détail sous le régime algérien du paiement à la livraison (COD).<br />
            Merci pour votre confiance envers la confection artisanale algérienne.
          </div>
        </div>
      </body>
      </html>
    `;
  };

  // Direct print action via hidden isolated iframe
  const handlePrint = () => {
    const html = generateInvoiceHtml();

    let iframe = document.getElementById('zaya-invoice-print-frame') as HTMLIFrameElement;
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.id = 'zaya-invoice-print-frame';
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      document.body.appendChild(iframe);
    }

    const doc = iframe.contentWindow?.document;
    if (!doc) {
      // Fallback
      window.print();
      return;
    }

    doc.open();
    doc.write(html);
    doc.close();

    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    }, 250);
  };

  // Download standalone HTML invoice file
  const handleDownload = () => {
    const html = generateInvoiceHtml();
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Facture-ZAYA-${order.id}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs animate-fadeIn overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-4xl bg-stone-100 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden border border-stone-300 my-auto">
        {/* Top Control Bar */}
        <div className="bg-[#1A1918] text-white px-5 sm:px-8 py-3.5 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#C5A880] text-[#1A1918] flex items-center justify-center font-bold">
              <Crown className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif-luxury text-sm sm:text-base font-bold text-white tracking-wider">
                  Facture d'Achat Maison ZAYA
                </h3>
                <span className="hidden sm:inline-block px-2 py-0.5 bg-white/10 text-[#C5A880] text-[10px] font-mono rounded">
                  {invoiceNumber}
                </span>
              </div>
              <p className="text-[11px] text-stone-400">
                Synthèse imprimable et téléchargeable pour votre commande #{order.id}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Primary Print / Save as PDF Button */}
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-[#C5A880] hover:bg-[#d6bb96] text-[#1A1918] rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer"
              title="Ouvre la boîte d'impression du navigateur (permet également 'Enregistrer en PDF')"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer / PDF</span>
            </button>

            {/* Download standalone file */}
            <button
              onClick={handleDownload}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-stone-200 hover:text-white rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
              title="Télécharger une copie du document HTML autonome"
            >
              <Download className="w-4 h-4 text-stone-300" />
              <span className="hidden md:inline">Télécharger</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer ml-1"
              title="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Invoice Canvas */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-stone-200/70">
          <div
            ref={invoicePaperRef}
            id="printable-invoice"
            className="w-full max-w-[210mm] mx-auto bg-white text-[#1A1918] p-6 sm:p-12 rounded-xl shadow-lg border border-stone-200 space-y-6"
          >
            {/* Gold Top Accent Line */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#1A1918] via-[#C5A880] to-[#1A1918] rounded-full" />

            {/* Header: Maison ZAYA & Invoice Meta */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-stone-200">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#1A1918] text-[#C5A880] flex items-center justify-center">
                    <Crown className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-serif-luxury text-2xl font-bold tracking-[0.25em] text-[#1A1918]">
                      ZAYA
                    </span>
                    <span className="block text-[9px] font-semibold uppercase tracking-[0.2em] text-[#A66C44]">
                      Haute Couture & Atelier Privé Alger
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-stone-500 leading-relaxed pt-1">
                  <p>14 Rue Didouche Mourad, Alger-Centre</p>
                  <p>Résidence Les Pins, Sidi Yahia, Hydra, Alger</p>
                  <p className="font-mono text-[10px] text-stone-400">
                    RC: 16/00-098234B22 · NIF: 002216098234120
                  </p>
                  <p>Concierge : +213 550 12 34 56 · contact@zaya-atelier.dz</p>
                </div>
              </div>

              <div className="bg-[#FAF8F5] border border-[#EAE4DC] rounded-xl p-4 sm:min-w-[260px] space-y-2 text-right sm:text-left">
                <div className="text-[10px] uppercase font-bold tracking-wider text-stone-500">
                  Facture Officielle d'Achat
                </div>
                <div className="font-mono text-base font-bold text-[#1A1918]">
                  {invoiceNumber}
                </div>
                <div className="text-xs text-stone-600 space-y-1 pt-1 border-t border-stone-200">
                  <p className="flex justify-between gap-2">
                    <span className="text-stone-400">Date :</span>
                    <span className="font-medium text-[#1A1918]">{orderDate}</span>
                  </p>
                  <p className="flex justify-between gap-2">
                    <span className="text-stone-400">Commande :</span>
                    <span className="font-mono font-bold text-[#1A1918]">#{order.id}</span>
                  </p>
                  <p className="flex justify-between gap-2">
                    <span className="text-stone-400">Transporteur :</span>
                    <span className="font-medium text-stone-800">Yalidine Express</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Bill To & Ship To Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#FAF8F5] border border-[#EAE4DC] rounded-xl p-4 space-y-1.5 text-xs">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#A66C44] block">
                  Facturé à (Client)
                </span>
                <p className="font-bold text-sm text-[#1A1918]">{order.customerName}</p>
                <p className="text-stone-600">
                  <span className="text-stone-400">Téléphone : </span>
                  <span className="font-mono">{phone}</span>
                </p>
                <p className="text-stone-600">
                  <span className="text-stone-400">Wilaya : </span>
                  {order.wilayaName} ({String(order.wilayaCode).padStart(2, '0')})
                </p>
              </div>

              <div className="bg-[#FAF8F5] border border-[#EAE4DC] rounded-xl p-4 space-y-1.5 text-xs">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#A66C44] block">
                  Acheminement & Livraison
                </span>
                <p className="font-bold text-sm text-[#1A1918]">
                  {order.deliveryMethod === 'desk'
                    ? 'Bureau Stop Desk (Yalidine Express)'
                    : 'Livraison à Domicile (Yalidine Express)'}
                </p>
                <p className="text-stone-600">
                  <span className="text-stone-400">Adresse : </span>
                  {order.address}
                </p>
                <p className="text-stone-600">
                  <span className="text-stone-400">Commune & Wilaya : </span>
                  {order.commune}, {order.wilayaName}
                </p>
              </div>
            </div>

            {/* Itemized Table */}
            <div>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F4EFEA] border-y border-[#DDD5CA] text-[10px] uppercase tracking-wider font-bold text-stone-600">
                    <th className="py-2.5 px-3">Modèle & Confection</th>
                    <th className="py-2.5 px-3 text-center">Taille</th>
                    <th className="py-2.5 px-3 text-center">Qté</th>
                    <th className="py-2.5 px-3 text-right">Prix Unitaire</th>
                    <th className="py-2.5 px-3 text-right">Montant (DA)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE4DC] text-xs">
                  {(order.items || []).map((item, idx) => (
                    <tr key={idx} className="hover:bg-stone-50/50">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.productName}
                              className="w-10 h-12 object-cover rounded border border-stone-200 shrink-0"
                            />
                          )}
                          <div>
                            <p className="font-bold text-[#1A1918]">{item.productName}</p>
                            <p className="text-[11px] text-stone-500">
                              Couleur : {item.color || 'Standard'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center font-medium text-stone-700">
                        {item.size || 'Unique'}
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-medium text-stone-800">
                        {item.quantity}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-stone-600">
                        {formatDA(item.unitPrice, language)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-[#1A1918]">
                        {formatDA(item.quantity * item.unitPrice, language)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial Summary & Atelier Stamp */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div className="space-y-3">
                {/* Certified Atelier Seal */}
                <div className="p-3.5 border-2 border-dashed border-[#C5A880] rounded-xl bg-[#FFFDF9] text-center space-y-1">
                  <div className="text-[10px] font-extrabold tracking-widest text-[#8C6239] uppercase">
                    ★ MAISON ZAYA HAUTE COUTURE ★
                  </div>
                  <p className="text-xs font-bold text-[#1A1918]">
                    CONTRÔLE ATELIER & QUALITÉ VALIDÉ
                  </p>
                  <p className="text-[10px] text-stone-500">
                    Certifié Conforme pour Expédition 58 Wilayas Yalidine Express
                  </p>
                </div>

                <div className="text-[11px] text-stone-500 space-y-1 leading-relaxed">
                  <p>
                    <strong>Mode de règlement :</strong>{' '}
                    {order.paymentMethod === 'baridimob'
                      ? 'BaridiMob / CCP'
                      : order.paymentMethod === 'bank_transfer'
                      ? 'Virement Bancaire / CIB'
                      : 'Règlement en espèces à la livraison (COD)'}
                  </p>
                  <p>
                    Conformément aux conditions de l'Atelier ZAYA, tout échange de taille ou modèle est possible sous 48h sur présentation de cette facture.
                  </p>
                </div>
              </div>

              {/* Total Calculation Card */}
              <div className="bg-[#FAF8F5] border border-[#EAE4DC] rounded-xl overflow-hidden text-xs">
                <div className="p-3.5 space-y-2 border-b border-[#EAE4DC]">
                  <div className="flex justify-between text-stone-600">
                    <span>Sous-total articles :</span>
                    <span className="font-mono font-medium">{formatDA(subtotal, language)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Remise privilège :</span>
                      <span className="font-mono font-bold">-{formatDA(discount, language)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-stone-600">
                    <span>Frais de livraison ({order.wilayaName}) :</span>
                    <span className="font-mono font-medium">
                      {deliveryFee === 0 ? 'Offert' : formatDA(deliveryFee, language)}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 bg-[#F4EFEA] flex items-center justify-between">
                  <span className="font-bold text-sm uppercase text-[#1A1918]">
                    Total Net à Payer :
                  </span>
                  <span className="font-serif-luxury text-lg font-bold text-[#1A1918]">
                    {formatDA(total, language)}
                  </span>
                </div>
              </div>
            </div>

            {/* Legal Footnote */}
            <div className="pt-4 border-t border-stone-200 text-center text-[10px] text-stone-400 leading-relaxed">
              Maison ZAYA Atelier Privé · SARL au capital de 10 000 000 DZD · RC Alger 16/00-098234B22<br />
              Ce document certifie l'authenticité de vos pièces confectionnées. Conservez-le pour tout besoin de garantie ou retouche sur-mesure.
            </div>
          </div>
        </div>

        {/* Modal Footer with Quick Print Call-to-Action */}
        <div className="bg-white border-t border-stone-200 px-5 sm:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-stone-500 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Format optimisé A4 portrait sans perte de qualité</span>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Fermer
            </button>
            <button
              onClick={handlePrint}
              className="px-5 py-2 bg-[#1A1918] hover:bg-black text-[#FAF8F5] rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[#C5A880]" />
              <span>Lancer l'impression (PDF)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
