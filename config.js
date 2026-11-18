/* =========================================================
   Teuto-Tour – zentrale Konfiguration
   Alles, was man anpassen möchte, steht hier.
   ========================================================= */
window.CONFIG = {
  APP_NAME: 'Teuto-Tour',
  TAGLINE: 'Trainingslager für die Bergischen 50',

  // Testmodus: Wenn true, erscheint mit ?test=1 in der URL ein Zeit-Simulator.
  // Für die veröffentlichte Version auf false lassen.
  TEST_MODE: false,

  // Wandertag (lokale Zeit). Ab diesem Tag 00:00 erscheint „Wanderung starten“.
  HIKE_DAY: '2026-11-21',
  // Ziel für den Countdown auf der Startseite („Samstag“)
  COUNTDOWN_TO: '2026-11-21T09:00:00',

  // Abstand der Stimmungs-Check-ins in Minuten
  CHECKIN_INTERVAL_MIN: 60,
  // Faktor: Luftlinie zwischen Check-ins → geschätzte Wegstrecke
  ROUTE_FACTOR: 1.3,
  // Fernziel für den Fortschrittsring
  GOAL_KM: 50,
  GOAL_LABEL: 'Bergischen 50', // „… der Bergischen 50“

  // Karte (Teutoburger Wald bei Detmold)
  MAP_CENTER: [51.902, 8.865],
  MAP_ZOOM: 12,
  // Kacheln, die beim ersten Öffnen für offline vorgeladen werden
  PREFETCH_BOUNDS: [[51.84, 8.76], [51.96, 8.98]], // [[Süd, West], [Nord, Ost]]
  PREFETCH_ZOOMS: [11, 12, 13, 14],

  // Teilnehmer: id (intern), Name, persönlicher Code für den Link (?p=CODE)
  PEOPLE: [
    { id: 'sven', name: 'Sven', code: 'wk7sjku' },
    { id: 'rico', name: 'Rico', code: 'kz3zzyx' },
    { id: 'jan',  name: 'Jan',  code: 'q45dh4q' },
    { id: 'tom',  name: 'Tom',  code: '9ahzw9m' },
  ],

  // Geheimnis für die Missions-Codes (beliebig, nur nicht ändern, wenn schon Codes verschickt wurden)
  MISSION_SALT: 'teuto-zq7cd4c',

  // Vorschläge für Missionen. points: 1 = leicht, 2 = mittel, 3 = schwer
  MISSION_POOL: [
    { text: 'Bring die Gruppe zu einem Gruppenfoto – es darf nicht nach deiner Idee aussehen.', points: 2 },
    { text: 'Fang ein Gespräch mit anderen Wanderern an (mindestens drei Sätze hin und her).', points: 1 },
    { text: 'Fordere jemanden auf einem breiten, ebenen Wegstück zum Wettsprint heraus. Der Verlierer zahlt das nächste Getränk.', points: 3 },
    { text: 'Bring das Wort „Kaiserschmarrn“ dreimal unauffällig ins Gespräch.', points: 2 },
    { text: 'Bring jemanden dazu, dir ein High Five zu geben.', points: 1 },
    { text: 'Setz eine Pause von mindestens fünf Minuten durch – ohne zuzugeben, dass du eine willst.', points: 2 },
    { text: 'Verschenke ein Fundstück aus dem Wald (Blatt, Zapfen, Stock) – mit einer ernsten Begründung.', points: 2 },
    { text: 'Bring jemand anderen dazu, als Erster „Buben“ zu sagen.', points: 2 },
    { text: 'Bring das Gespräch auf die Bergischen 50 nächstes Jahr – ohne sie selbst zu erwähnen.', points: 3 },
    { text: 'Erzähl einen erfundenen Fakt über das Hermannsdenkmal so überzeugend, dass jemand nachfragt.', points: 2 },
    { text: 'Summ ein Lied, bis jemand mitsummt oder es erkennt.', points: 2 },
    { text: 'Bring jemanden dazu, dir freiwillig etwas von seinem Snack abzugeben.', points: 1 },
    { text: 'Lass das Wort „Höhenmeter“ fünfmal ganz beiläufig fallen.', points: 1 },
    { text: 'Bring die Gruppe dazu, über irgendetwas abzustimmen.', points: 2 },
    { text: 'Bring jemanden dazu, „Wie weit ist es noch?“ zu fragen – bevor du es selbst tust.', points: 2 },
    { text: 'Gib jemandem einen Spitznamen, den bis zum Abend mindestens zwei andere benutzen.', points: 3 },
    { text: 'Führ die Gruppe mindestens 15 Minuten lang an der Spitze an.', points: 1 },
    { text: 'Bring jemanden dazu, eine Wette mit dir einzugehen (Einsatz: ein Getränk).', points: 2 },
    { text: 'Starte eine Diskussion über den besten Wander-Snack – und gewinne sie.', points: 2 },
    { text: 'Bring jemanden dazu, ein Tiergeräusch nachzumachen.', points: 3 },
    { text: 'Lobe dreimal ausführlich die Aussicht – ganz egal, wie sie gerade ist.', points: 1 },
    { text: 'Führ ein Gruppenritual ein (z. B. Kampfschrei nach jeder Pause) und bring die anderen dazu, es mindestens zweimal mitzumachen.', points: 3 },
    { text: 'Erzähl von einem Traum, den du angeblich letzte Nacht hattest – mit einem der anderen in der Hauptrolle.', points: 1 },
    { text: 'Bring jemanden dazu, ein Selfie mit dir zu machen.', points: 1 },
    { text: 'Bring jemanden dazu, dir zu erklären, wie man richtig wandert – und hör aufmerksam zu.', points: 2 },
    { text: 'Bring die Gruppe dazu, gemeinsam anzustoßen (egal womit).', points: 2 },
  ],

  // Lustige Zähler im Tagebuch
  COUNTERS: [
    { id: 'pee',     label: 'Pinkelpausen',        emoji: '💦' },
    { id: 'snacks',  label: 'Snacks',              emoji: '🥨' },
    { id: 'howfar',  label: '„Wie weit ist es noch?“', emoji: '🙄' },
    { id: 'lost',    label: 'Verlaufen',           emoji: '🧭' },
    { id: 'animals', label: 'Tiere gesichtet',     emoji: '🦌' },
    { id: 'blister', label: 'Blasen-Alarm',        emoji: '🩹' },
  ],

  // Stimmung (schlecht → super)
  MOODS: ['😫', '😕', '😐', '🙂', '🤩'],
};
