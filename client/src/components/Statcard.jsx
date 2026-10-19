const toneStyles = {
  brand: { bg: "bg-brand-light", text: "text-brand-dark" },
  teal: { bg: "bg-teal-light", text: "text-teal" },
  amber: { bg: "bg-amber-light", text: "text-amber" },
  coral: { bg: "bg-coral-light", text: "text-coral" },
};

function StatCard({ title, value, icon, tone = "brand" }) {
  const styles = toneStyles[tone] || toneStyles.brand;

  return (
    <div className="bg-white rounded-2xl border border-ink/5 shadow-sm p-6 hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-muted">{title}</h3>
          <p className="font-display text-3xl font-bold text-ink mt-2">
            {value}
          </p>
        </div>

        {icon && (
          <span
            className={`w-11 h-11 rounded-xl ${styles.bg} ${styles.text} flex items-center justify-center`}
          >
            {icon}
          </span>
        )}
      </div>
    </div>
  );
}

export default StatCard;
