interface Props {
  fillAmount: number;
}

function WaterBar({ fillAmount }: Props) {
  return (
    <div
      className="progress"
      role="progressbar"
      aria-label="Animated striped example"
      aria-valuenow={fillAmount}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="progress-bar progress-bar-striped progress-bar-animated"
        style={{ width: `${fillAmount}%` }}
      ></div>
    </div>
  );
}

export default WaterBar;
