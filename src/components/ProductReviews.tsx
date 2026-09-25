import React, { useState, useEffect } from 'react';
import { Star, ShieldCheck, CheckCircle2, MessageSquare, AlertCircle, Sparkles, Send, Edit3, UserCheck, Lock } from 'lucide-react';
import { Product, ProductReview, Language } from '../types';
import { useAuth } from '../context/AuthContext';

interface ProductReviewsProps {
  product: Product;
  language: Language;
  onPromptAuth?: () => void;
  onReviewSubmitted?: (newRating: number, newCount: number) => void;
}

interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  breakdown: Record<number, number>;
}

interface UserReviewStatus {
  isAuthenticated: boolean;
  hasPurchased: boolean;
  hasReviewed: boolean;
  existingReview: ProductReview | null;
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({
  product,
  language,
  onPromptAuth,
  onReviewSubmitted
}) => {
  const { user, token } = useAuth();
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [stats, setStats] = useState<ReviewStats>({
    averageRating: product.rating || 5.0,
    totalReviews: product.reviewCount || 0,
    breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });
  const [userStatus, setUserStatus] = useState<UserReviewStatus>({
    isAuthenticated: !!user,
    hasPurchased: false,
    hasReviewed: false,
    existingReview: null
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [showForm, setShowForm] = useState<boolean>(false);

  // Form State
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [title, setTitle] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [fitFeedback, setFitFeedback] = useState<'true_to_size' | 'runs_small' | 'runs_large'>('true_to_size');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // Filter state
  const [selectedFilter, setSelectedFilter] = useState<number | 'all'>('all');

  const isArabic = language === 'ar';

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`/api/products/${product.id}/reviews`, { headers });
      const data = await res.json();

      if (data.success) {
        setReviews(data.reviews || []);
        if (data.stats) {
          setStats(data.stats);
        }
        if (data.userStatus) {
          setUserStatus(data.userStatus);
          if (data.userStatus.existingReview) {
            setRating(data.userStatus.existingReview.rating || 5);
            setTitle(data.userStatus.existingReview.title || '');
            setComment(data.userStatus.existingReview.comment || '');
            if (data.userStatus.existingReview.fitFeedback) {
              setFitFeedback(data.userStatus.existingReview.fitFeedback);
            }
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [product.id, token]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      if (onPromptAuth) onPromptAuth();
      return;
    }

    if (!comment.trim() || comment.trim().length < 5) {
      setFormError(isArabic ? 'يرجى كتابة تعليق لا يقل عن 5 أحرف.' : 'Veuillez saisir un commentaire d’au moins 5 caractères.');
      return;
    }

    setSubmitting(true);
    setFormError(null);
    setFormSuccess(null);

    try {
      const res = await fetch(`/api/products/${product.id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          rating,
          title: title.trim(),
          comment: comment.trim(),
          fitFeedback
        })
      });

      const data = await res.json();
      if (data.success) {
        setFormSuccess(data.message || (isArabic ? 'تم نشر تقييمك بنجاح.' : 'Votre avis a été enregistré avec succès.'));
        await fetchReviews();
        setShowForm(false);
        if (onReviewSubmitted && stats) {
          onReviewSubmitted(stats.averageRating, stats.totalReviews + (userStatus.hasReviewed ? 0 : 1));
        }
      } else {
        setFormError(data.error || (isArabic ? 'حدث خطأ أثناء النشر.' : 'Une erreur est survenue lors de l’envoi.'));
      }
    } catch (err: any) {
      setFormError(err.message || (isArabic ? 'Erreur de connexion.' : 'Erreur de connexion'));
    } finally {
      setSubmitting(false);
    }
  };

  const ratingLabels: Record<number, { fr: string; ar: string }> = {
    5: { fr: 'Exceptionnel (5/5)', ar: 'ممتاز جداً (5/5)' },
    4: { fr: 'Très bien (4/5)', ar: 'جيد جداً (4/5)' },
    3: { fr: 'Bien (3/5)', ar: 'جيد (3/5)' },
    2: { fr: 'Moyen (2/5)', ar: 'متوسط (2/5)' },
    1: { fr: 'Décevant (1/5)', ar: 'غير مرضٍ (1/5)' }
  };

  const filteredReviews = selectedFilter === 'all'
    ? reviews
    : reviews.filter(r => Math.round(r.rating) === selectedFilter);

  return (
    <div className="mt-8 pt-8 border-t border-[#EAE4DC] space-y-6">
      {/* Header & Overall Rating */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F3EFE9] border border-[#DDD5CA] text-[10px] uppercase tracking-wider text-[#8C6B3F] font-semibold mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>{isArabic ? 'تقييمات موثقة ومؤكدة' : 'Avis Clientes Certifiés'}</span>
          </div>
          <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#1A1918]">
            {isArabic ? 'آراء وتجارب الزبائن' : 'Avis & Témoignages Clientes'}
          </h3>
          <p className="text-xs text-[#736B60]">
            {isArabic
              ? 'ملاحظات حقيقية من زبونات قمن بطلب هذا الموديل وتجربته'
              : 'Retours d’expérience vérifiés sur la coupe, le tissu et la tenue'}
          </p>
        </div>

        {/* Global Rating Badge */}
        <div className="flex items-center gap-3 bg-[#FAF8F5] border border-[#DDD5CA] p-3 rounded-lg shadow-2xs">
          <div className="text-center">
            <span className="font-serif-luxury text-3xl font-bold text-[#1A1918] leading-none">
              {stats.averageRating.toFixed(1)}
            </span>
            <span className="text-[10px] text-stone-500 block">/ 5</span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-0.5 text-amber-500">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-4 h-4 ${
                    s <= Math.round(stats.averageRating)
                      ? 'fill-amber-400 text-amber-500'
                      : 'text-stone-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-[11px] text-[#544D44] font-medium block">
              {stats.totalReviews} {stats.totalReviews > 1 ? (isArabic ? 'تقييمات' : 'avis clientes') : (isArabic ? 'تقييم' : 'avis client')}
            </span>
          </div>
        </div>
      </div>

      {/* Breakdown Bars */}
      {stats.totalReviews > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 border border-[#EAE4DC] rounded-lg">
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-stone-800 block">
              {isArabic ? 'توزيع التقييمات :' : 'Répartition des notes :'}
            </span>
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = stats.breakdown[stars] || 0;
              const pct = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
              return (
                <div key={stars} className="flex items-center gap-2 text-xs text-stone-600">
                  <span className="w-6 font-medium text-right text-[11px]">{stars} ★</span>
                  <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden border border-stone-200">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-8 text-[11px] text-stone-500 text-right">{count}</span>
                </div>
              );
            })}
          </div>

          {/* Guarantees Box */}
          <div className="border-t sm:border-t-0 sm:border-l border-[#EAE4DC] sm:pl-4 flex flex-col justify-center space-y-2 text-xs text-[#544D44]">
            <div className="flex items-center gap-2 font-medium text-stone-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{isArabic ? 'ضمان المقاس والتجربة' : 'Garantie Taille & Tombé'}</span>
            </div>
            <p className="text-[11px] text-stone-500 leading-relaxed">
              {isArabic
                ? 'يمكنك تجربة القطعة عند استلامها والتأكد من المقاس قبل الدفع النهائي مع خدمة التبديل المجانية خلال 48 ساعة.'
                : 'Essayage possible à la livraison avant paiement. Service d’échange de taille rapide en 48h sur simple message WhatsApp.'}
            </p>
          </div>
        </div>
      )}

      {/* Verified Buyer Call-To-Action Box */}
      <div className="bg-[#FAF8F5] border border-[#DDD5CA] rounded-lg p-4 space-y-3">
        {!user ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-stone-700">
              <Lock className="w-4 h-4 text-stone-500 shrink-0" />
              <span>
                {isArabic
                  ? 'هل طلبت هذا الموديل مسبقاً؟ سجلي دخولك لمشاركة تجربتك وتقييمك.'
                  : 'Avez-vous déjà commandé ce modèle ? Connectez-vous pour laisser votre avis vérifié.'}
              </span>
            </div>
            {onPromptAuth && (
              <button
                type="button"
                onClick={onPromptAuth}
                className="px-4 py-2 bg-[#1A1918] text-[#FAF8F5] text-xs uppercase font-semibold tracking-wider rounded-md hover:bg-black transition-colors self-start sm:self-auto cursor-pointer"
              >
                {isArabic ? 'تسجيل الدخول' : 'Se Connecter'}
              </button>
            )}
          </div>
        ) : userStatus.hasPurchased ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-emerald-800">
              <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-medium">
                {userStatus.hasReviewed
                  ? (isArabic ? 'لقد قمت بتقييم هذا الموديل مسبقاً. يمكنك تعديل رأيك في أي وقت.' : 'Vous avez déjà évalué cette création. Vous pouvez actualiser votre avis.')
                  : (isArabic ? 'أنت زبونة مؤكدة لهذا الموديل! شاركي انطباعك لمساعدة باقي الزبونات.' : 'Achat vérifié confirmé ! Partagez votre ressenti sur cette pièce d’atelier.')}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 bg-[#1A1918] text-[#FAF8F5] text-xs uppercase font-semibold tracking-wider rounded-md hover:bg-black transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>
                {showForm
                  ? (isArabic ? 'إخفاء الاستمارة' : 'Fermer le formulaire')
                  : userStatus.hasReviewed
                  ? (isArabic ? 'تعديل تقييمي' : 'Modifier mon avis')
                  : (isArabic ? 'كتابة تقييم معتمد' : 'Déposer mon avis')}
              </span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 text-xs text-[#736B60]">
            <ShieldCheck className="w-4 h-4 text-[#C5A880] shrink-0" />
            <span>
              {isArabic
                ? 'لحماية موثوقية التقييمات، تقتصر كتابة المراجعات على الزبونات اللاتي قمن بطلب هذا الموديل فعلياً.'
                : 'Par souci d’authenticité, la publication d’avis est réservée aux clientes ayant effectivement commandé cette pièce.'}
            </span>
          </div>
        )}

        {/* Feedback Alerts */}
        {formSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-md text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{formSuccess}</span>
          </div>
        )}

        {formError && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {/* Interactive Review Form */}
        {showForm && (
          <form onSubmit={handleSubmitReview} className="pt-4 border-t border-[#EAE4DC] space-y-4">
            {/* Star Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-800 block">
                {isArabic ? 'تقييمك الإجمالي :' : 'Votre note globale :'}
              </label>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((starVal) => {
                    const activeVal = hoverRating || rating;
                    return (
                      <button
                        key={starVal}
                        type="button"
                        onClick={() => setRating(starVal)}
                        onMouseEnter={() => setHoverRating(starVal)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 text-amber-500 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            starVal <= activeVal
                              ? 'fill-amber-400 text-amber-500'
                              : 'text-stone-300'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
                <span className="text-xs font-medium text-stone-600">
                  {ratingLabels[rating]?.[language === 'ar' ? 'ar' : 'fr']}
                </span>
              </div>
            </div>

            {/* Fit Feedback */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-800 block">
                {isArabic ? 'كيف وجدت المقاس والقصّة ؟' : 'Comment taille cette pièce ?'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'true_to_size', fr: 'Fidèle à la taille', ar: 'مقاس مضبوط تماماً' },
                  { id: 'runs_small', fr: 'Taille petit', ar: 'مقاس أصغر قليلاً' },
                  { id: 'runs_large', fr: 'Taille grand / ample', ar: 'مقاس واسع / فضفاض' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setFitFeedback(opt.id as any)}
                    className={`py-2 px-2 text-xs rounded-md border text-center transition-all cursor-pointer ${
                      fitFeedback === opt.id
                        ? 'bg-[#1A1918] text-[#FAF8F5] border-[#1A1918] font-semibold'
                        : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    {isArabic ? opt.ar : opt.fr}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-800 block">
                {isArabic ? 'عنوان رأيك (اختياري) :' : 'Titre de votre avis (optionnel) :'}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={isArabic ? 'مثال: قفطان فخم وقماش راقٍ جداً' : 'Ex : Sublime tombé, étoffe très agréable'}
                className="w-full px-3 py-2 bg-white border border-[#DDD5CA] rounded-md text-xs text-stone-900 focus:outline-none focus:border-[#C5A880]"
                maxLength={100}
              />
            </div>

            {/* Comment */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-800 block">
                {isArabic ? 'ملاحظاتك بالتفصيل :' : 'Votre commentaire d’expérience :'}
              </label>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={isArabic
                  ? 'صفي تجربتك مع القماش، الخياطة، الراحة في اللبس والتوصيل...'
                  : 'Parlez de la texture du tissu, de la précision des finitions, du confort et de la livraison...'}
                className="w-full px-3 py-2 bg-white border border-[#DDD5CA] rounded-md text-xs text-stone-900 focus:outline-none focus:border-[#C5A880]"
                maxLength={1000}
                required
              />
              <span className="text-[10px] text-stone-400 block text-right">
                {comment.length} / 1000
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-stone-300 text-stone-700 text-xs font-medium rounded-md hover:bg-stone-50 cursor-pointer"
              >
                {isArabic ? 'إلغاء' : 'Annuler'}
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 bg-[#1A1918] hover:bg-black text-[#FAF8F5] text-xs font-semibold uppercase tracking-wider rounded-md transition-colors flex items-center gap-1.5 disabled:bg-stone-400 cursor-pointer"
              >
                {submitting ? (
                  <span>{isArabic ? 'جارٍ الحفظ...' : 'Envoi en cours...'}</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span>{userStatus.hasReviewed ? (isArabic ? 'تحديث التقييم' : 'Mettre à jour') : (isArabic ? 'نشر التقييم' : 'Publier mon avis')}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Reviews List & Filters */}
      <div className="space-y-4">
        {reviews.length > 0 && (
          <div className="flex items-center justify-between pb-2 border-b border-[#EAE4DC]">
            <span className="text-xs font-semibold text-stone-700">
              {filteredReviews.length} {filteredReviews.length > 1 ? (isArabic ? 'تقييمات معروضة' : 'avis affichés') : (isArabic ? 'تقييم معروض' : 'avis affiché')}
            </span>

            {/* Star Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-[11px]">
              <button
                type="button"
                onClick={() => setSelectedFilter('all')}
                className={`px-2.5 py-1 rounded-full cursor-pointer transition-colors ${
                  selectedFilter === 'all'
                    ? 'bg-[#1A1918] text-white font-medium'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {isArabic ? 'الكل' : 'Tous'}
              </button>
              {[5, 4, 3].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setSelectedFilter(num)}
                  className={`px-2.5 py-1 rounded-full cursor-pointer transition-colors flex items-center gap-0.5 ${
                    selectedFilter === num
                      ? 'bg-[#1A1918] text-white font-medium'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  <span>{num}</span>
                  <Star className="w-2.5 h-2.5 fill-current text-amber-400" />
                </button>
              ))}
            </div>
          </div>
        )}

        {filteredReviews.length === 0 ? (
          <div className="py-8 text-center bg-white border border-[#EAE4DC] rounded-lg p-6 space-y-2">
            <MessageSquare className="w-8 h-8 text-stone-300 mx-auto" />
            <p className="font-serif-luxury text-base text-stone-700">
              {isArabic ? 'لا توجد تقييمات مطابقة حالياً' : 'Aucun avis pour cette note'}
            </p>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              {isArabic
                ? 'كوني أول من يشارك تجربته مع هذا التصميم الراقي.'
                : 'Soyez la première cliente à partager votre ressenti sur cette création.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4 divide-y divide-[#EAE4DC]">
            {filteredReviews.map((rev) => {
              const initial = rev.userName ? rev.userName.charAt(0).toUpperCase() : 'Z';
              const dateStr = new Date(rev.createdAt).toLocaleDateString(
                language === 'ar' ? 'ar-DZ' : 'fr-FR',
                { year: 'numeric', month: 'short', day: 'numeric' }
              );

              return (
                <div key={rev.id} className="pt-4 first:pt-0 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#1A1918] text-[#FAF8F5] flex items-center justify-center font-serif-luxury font-bold text-xs shrink-0 shadow-2xs">
                        {initial}
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-bold text-stone-900">
                            {rev.userName}
                          </span>

                          {rev.verifiedPurchase && (
                            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-semibold">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>{isArabic ? 'شراء معتمد' : 'Achat Vérifié'}</span>
                            </span>
                          )}

                          {rev.userWilaya && (
                            <span className="text-[11px] text-stone-400">
                              • {rev.userWilaya}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 mt-0.5">
                          <div className="flex items-center text-amber-500">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-3.5 h-3.5 ${
                                  s <= rev.rating
                                    ? 'fill-amber-400 text-amber-500'
                                    : 'text-stone-200'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-[11px] text-stone-400">{dateStr}</span>
                        </div>
                      </div>
                    </div>

                    {/* Fit tag */}
                    {rev.fitFeedback && (
                      <span className="hidden sm:inline-block px-2.5 py-1 bg-stone-100 text-stone-700 text-[10px] rounded-md font-medium">
                        {rev.fitFeedback === 'true_to_size'
                          ? (isArabic ? 'مقاس مضبوط' : 'Fidèle à la taille')
                          : rev.fitFeedback === 'runs_small'
                          ? (isArabic ? 'مقاس صغير' : 'Taille petit')
                          : (isArabic ? 'مقاس واسع' : 'Taille grand')}
                      </span>
                    )}
                  </div>

                  {rev.title && (
                    <h5 className="text-xs font-bold text-stone-900 pt-0.5">
                      {rev.title}
                    </h5>
                  )}

                  <p className="text-xs text-stone-700 leading-relaxed whitespace-pre-line">
                    {rev.comment}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
