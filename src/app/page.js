
import styles from './glitchEffect.module.scss';
export default function Home() {
  return (
    <div>
      <main className="flex flex-col items-center justify-center h-[85vh] text-center mb-4">
        <h1 className={`${styles.glitch} text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-beige mt-4`} data-text="XR Engineering Club">
          XR Engineering Club
        </h1>
        <p className="mt-2 text-lg sm:text-xl md:text-2xl text-beige">
          Welcome to XREC&#39;s Official Website
        </p>
      </main>
    </div>
  );
}
