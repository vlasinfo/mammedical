// snowflake.runtime.module.js
export default function initSnowflake() {
  
  if (!window.Snowflake) {
    console.warn("Snowflake not available");
    return;
  }

  // старт (якщо ще не стартував)
  Snowflake.start();

  // ❄️ налаштування — ВСІ ПРАЦЮЮТЬ
  Snowflake.size(1);       // множник (1 = стандарт)
  Snowflake.speed(1);
  Snowflake.density(0.6);
  Snowflake.opacity(0.25);
  Snowflake.quality(2);
  Snowflake.index(9999);

  // mount можна міняти в runtime
  Snowflake.mount(document.body);
  
}
