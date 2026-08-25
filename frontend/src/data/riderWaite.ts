export interface IRiderWaiteCard {
    name: string;
    meaning_up: string;
    desc: string;
    meaning_up_he?: string;
    desc_he?: string;
}

export const riderWaiteCards: IRiderWaiteCard[] = [
    // ── MAJOR ARCANA ──────────────────────────────────────────────────────────
    {
        name: "The Fool",
        meaning_up: "Folly, mania, extravagance, intoxication, delirium, frenzy, bewrayment.",
        desc: "With light step, as if earth and its trammels had little power to restrain him, a young man in gorgeous vestments pauses at the brink of a precipice among the great heights of the world; he surveys the blue distance before him-its expanse of sky rather than the prospect below. His act of eager walking is still indicated, though he is stationary at the given moment; his dog is still bounding. The edge which opens on the depth has no terror; it is as if angels were waiting to uphold him, if it came about that he leaped from the height. His countenance is full of intelligence and expectant dream. He has a rose in one hand and in the other a costly wand, from which depends over his right shoulder a wallet curiously embroidered. He is a prince of the other world on his travels through this one-all amidst the morning glory, in the keen air. The sun, which shines behind him, knows whence he came, whither he is going, and how he will return by another path after many days. He is the spirit in search of experience.",
        meaning_up_he: "פזיזות, טירוף מוחלט, הפקרות, שכרון, סחרחורת, תזזית, חשיפת סוד.",
        desc_he: "בצעד קל, כאילו כבלי הארץ נטולי כל אחיזה בו, צועד עלם לבוש הדר אל שולי תהום, בין הפסגות הגדולות של העולם; מבטו נישא אל התכלת שלפניו – אל מרחבי השמיים ולא אל התהום שלרגליו. תנועת הליכתו הנלהבת עדיין ניכרת אף שהוא עומד כרגע במקומו; כלבו עודנו קופץ סביבו. קצה התהום הנפער אינו מטיל בו אימה, כאילו מלאכים ממתינים לתומכו אילו קפץ מן הגובה. פניו מלאות תבונה וחלום דרוך. בידו האחת ורד, ובאחרת מקל יקר ערך, שממנו תלוי על כתפו ילקוט רקום להפליא. הוא נסיך מעולם אחר הנודד בעולם הזה, כולו הוד בוקר באוויר הצלול. השמש הזורחת מאחוריו יודעת מנין בא, לאן פניו מועדות וכיצד ישוב בדרך אחרת לאחר ימים רבים. הוא הרוח היוצאת לחפש התנסות."
    },
    {
        name: "The Magician",
        meaning_up: "Skill, diplomacy, address, subtlety; sickness, pain, loss, disaster, snares of enemies; self-confidence, will; the Querent, if male.",
        desc: "A youthful figure in the robe of a magician, having the countenance of divine Apollo, with smile of confidence and shining eyes. Above his head is the mysterious sign of the Holy Spirit, the sign of life, like an endless cord, forming the figure 8 in a horizontal position. About his waist is a serpent-cincture, the serpent appearing to devour its own tail. This is familiar to most as a conventional symbol of eternity, but here it indicates more especially the eternity of attainment in the spirit. In the Magician's right hand is a wand raised towards heaven, while the left hand is pointing to the earth. This dual sign is known in very high grades of the Instituted Mysteries; it shews the descent of grace, virtue and light, drawn from things above and derived to things below. The suggestion throughout is therefore the possession and communication of the Powers and Gifts of the Spirit. On the table in front of the Magician are the symbols of the four Tarot suits, signifying the elements of natural life, which lie like counters before the adept, and he adapts them as he wills. Beneath are roses and lilies, the flos campi and lilium convallium, changed into garden flowers, to shew the culture of aspiration.",
        meaning_up_he: "מיומנות, דיפלומטיה, תושייה, עדינות; גם מחלה, כאב, אובדן, אסון, מלכודות אויבים; ביטחון עצמי, כוח רצון; השואל עצמו, אם הוא גבר.",
        desc_he: "דמות צעירה בגלימת קוסם, בעלת ארשת פנים של אפולו האלוהי, עם חיוך ביטחון ועיניים נוצצות. מעל ראשו סימן הרוח הקדושה המסתורי, סימן החיים, כחבל אינסופי היוצר את הספרה 8 במאוזן. מותניו חגורים בנחש הבולע את זנבו – סמל מוכר לנצח, אך כאן הוא מציין בעיקר את נצחיות ההשגה שברוח. בידו הימנית של הקוסם מקל מורם השמימה, ובשמאלית הוא מצביע אל האדמה – סימן כפול הידוע בדרגות הגבוהות של המסתורין, המבטא את ירידת החסד, המידה הטובה והאור מן הגבוה אל הנמוך. המשמעות היא אפוא החזקה והעברה של כוחות ומתנות הרוח. על השולחן שלפני הקוסם מונחים סמלי ארבעת החפיסות – מציינים את יסודות החיים הטבעיים, מונחים כמו אסימונים לפני האמן, המתאים אותם כרצונו. מתחת מונחים ורדים ושושנים, שהפכו לפרחי גן, לביטוי טיפוח השאיפה."
    },
    {
        name: "The High Priestess",
        meaning_up: "Secrets, mystery, the future as yet unrevealed; the woman who interests the Querent, if male; the Querent herself, if female; silence, tenacity; mystery, wisdom, science.",
        desc: "She has the lunar crescent at her feet, a horned diadem on her head, with a globe in the middle place, and a large solar cross on her breast. The scroll in her hands is inscribed with the word Tora, signifying the Greater Law, the Secret Law and the second sense of the Word. It is partly covered by her mantle, to shew that some things are implied and some spoken. She is seated between the white and black pillars--J. and B.--of the mystic Temple, and the veil of the Temple is behind her: it is embroidered with palms and pomegranates. The vestments are flowing and gauzy, and the mantle suggests light--a shimmering radiance. She has been called occult Science on the threshold of the Sanctuary of Isis, but she is really the Secret Church, the House which is of God and man. She represents also the Second Marriage of the Prince who is no longer of this world; she is the spiritual Bride and Mother, the daughter of the stars and the Higher Garden of Eden.",
        meaning_up_he: "סודות, מסתורין, עתיד שטרם נגלה; האישה המעניינת את השואל, אם הוא גבר; השואלת עצמה, אם היא אישה; שתיקה, התמדה; תעלומה, חוכמה, דעת.",
        desc_he: "לרגליה סהר הירח, ועל ראשה כתר קרניים ובמרכזו כדור, ועל חזה צלב שמש גדול. המגילה בידיה נושאת את המילה 'תורה', המציינת את החוק הגדול, החוק הנסתר והמשמעות השנייה של המילה. היא מכוסה חלקית באדרתה, לרמז שדברים מסוימים נרמזים ואחרים נאמרים. היא יושבת בין העמודים הלבן והשחור – י' וב' – של המקדש המיסטי, ופרוכת המקדש מאחוריה, רקומה בתמרים ורימונים. לבושה זורם ואוורירי, ואדרתה מרמזת על אור – זוהר מרצד. כונתה מדע נסתר על סף מקדש איזיס, אך למעשה היא הכנסייה הסודית, הבית אשר לאל ולאדם. היא מייצגת גם את הנישואין השניים של הנסיך שאינו עוד מן העולם הזה; היא הכלה הרוחנית והאם, בת הכוכבים וגן העדן העליון."
    },
    {
        name: "The Empress",
        meaning_up: "Fruitfulness, action, initiative, length of days; the unknown, clandestine; also difficulty, doubt, ignorance.",
        desc: "A stately figure, seated, having rich vestments and royal aspect, as of a daughter of heaven and earth. Her diadem is of twelve stars, gathered in a cluster. The symbol of Venus is on the shield which rests near her. A field of corn is ripening in front of her, and beyond there is a fall of water. The sceptre which she bears is surmounted by the globe of this world. She is the inferior Garden of Eden, the Earthly Paradise, all that is symbolized by the visible house of man. She is not Regina coeli, but she is still refugium peccatorum, the fruitful mother of thousands. There are also certain aspects in which she has been correctly described as desire and the wings thereof, as the woman clothed with the sun, as Gloria Mundi and the veil of the Sanctum Sanctorum. She is above all things universal fecundity and the outer sense of the Word.",
        meaning_up_he: "פוריות, פעולה, יוזמה, אריכות ימים; הבלתי נודע, החשאי; גם קושי, ספק, בורות.",
        desc_he: "דמות מלכותית ויושבת, לבושה גלימות עשירות ובעלת הדר מלכותי, כבת שמיים וארץ. כתרה עשוי שנים עשר כוכבים מקובצים יחד. סמל ונוס חקוק על המגן הסמוך לה. שדה תבואה מבשיל לפניה, ומעבר לו מפל מים. השרביט שהיא נושאת עטור בכדור העולם הזה. היא גן העדן התחתון, גן העדן הארצי, כל מה שמסמל בית האדם הנראה לעין. אין היא מלכת השמיים, אך היא עודנה מפלט לחוטאים, אם פורייה לרבבות. יש הרואים בה גם את התשוקה על כנפיה, את האישה הלבושה שמש, את תפארת העולם ואת פרוכת קודש הקודשים. היא מעל לכול הפריון האוניברסלי והמובן החיצוני של הדיבור."
    },
    {
        name: "The Emperor",
        meaning_up: "Stability, power, protection, realization; a great person; aid, reason, conviction; also authority and will.",
        desc: "He has a form of the Crux ansata for his sceptre and a globe in his left hand. He is a crowned monarch--commanding, stately, seated on a throne, the arms of which are fronted by rams' heads. He is executive and realization, the power of this world, here clothed with the highest of its natural attributes. He is occasionally represented as seated on a cubic stone, which, however, confuses some of the issues. He is the virile power, to which the Empress responds, and in this sense is he who seeks to remove the Veil of Isis; yet she remains virgo intacta. It should be understood that this card and that of the Empress do not precisely represent the condition of married life, though this state is implied. On the surface, as I have indicated, they stand for mundane royalty, uplifted on the seats of the mighty; but above this there is the suggestion of another presence. They signify also--and the male figure especially--the higher kingship, occupying the intellectual throne.",
        meaning_up_he: "יציבות, כוח, הגנה, מימוש; אדם דגול; סיוע, היגיון, שכנוע; גם סמכות ורצון.",
        desc_he: "בידו שרביט בצורת צלב אנך, ובשמאלו כדור עולם. הוא מלך מוכתר – מצווה, מלכותי, יושב על כס שזרועותיו מעוטרות בראשי אילים. הוא הביצוע וההגשמה, כוחו של עולם זה, לבוש כאן בתכונותיו הטבעיות הנעלות ביותר. לעיתים הוא מתואר יושב על אבן מרובעת, אך הדבר מבלבל מעט את הסוגיה. הוא הכוח הגברי שהקיסרית מגיבה לו, ובמובן זה הוא המבקש להסיר את צעיף איזיס; ועם זאת נותרת היא בתולה שלמה. יש להבין כי קלף זה וקלף הקיסרית אינם מייצגים בדיוק את מצב חיי הנישואין, אף שמצב זה נרמז. על פני השטח, כפי שציינתי, הם מייצגים מלכות ארצית, מרוממים על כסאות האדירים; אך מעבר לכך נרמזת נוכחות נוספת. הם מסמלים גם – ובעיקר הדמות הגברית – את המלכות הרוחנית העליונה, היושבת על כס השכל."
    },
    {
        name: "The Hierophant",
        meaning_up: "Marriage, alliance, captivity, servitude; by another account, mercy and goodness; inspiration; the man to whom the Querent has recourse.",
        desc: "He wears the triple crown and is seated between two pillars, but they are not those of the Temple which is guarded by the High Priestess. In his left hand he holds a sceptre terminating in the triple cross, and with his right hand he gives the well-known ecclesiastical sign which is called that of esotericism, distinguishing between the manifest and concealed part of doctrine. At his feet are the crossed keys, and two priestly ministers in albs kneel before him. He has been usually called the Pope, which is a particular application of the more general office that he symbolizes. He is the ruling power of external religion, as the High Priestess is the prevailing genius of the esoteric, withdrawn power. He is rather the summa totius theologiæ, when it has passed into the utmost rigidity of expression; but he symbolizes also all things that are righteous and sacred on the manifest side. As such, he is the channel of grace belonging to the world of institution as distinct from that of Nature, and he is the leader of salvation for the human race at large.",
        meaning_up_he: "נישואין, ברית, שביה, שעבוד; ולפי גרסה אחרת, רחמים וטוּב; השראה; האיש שאליו פונה השואל.",
        desc_he: "הוא חובש כתר משולש ויושב בין שני עמודים, אך אלה אינם עמודי המקדש שעליהם שומרת הכוהנת הגדולה. בידו השמאלית שרביט המסתיים בצלב משולש, ובימינו הוא נותן את הסימן הכנסייתי הידוע כסימן האזוטריות, המבחין בין החלק הגלוי לנסתר של התורה. לרגליו מפתחות מוצלבים, ושני משרתים כמרים בגלימות לבנות כורעים לפניו. נהוג לכנותו האפיפיור, שהיא יישום פרטי של תפקיד כללי יותר שהוא מסמל. הוא הכוח השולט של הדת החיצונית, כפי שהכוהנת הגדולה היא הגאון השורר של הכוח האזוטרי הנסתר. הוא סך כל התאולוגיה כשהיא הגיעה לקשיחות המרבית של הביטוי; אך הוא מסמל גם את כל הדברים הצדיקים והקדושים שבצד הגלוי. ככזה הוא צינור החסד השייך לעולם המוסד, בניגוד לעולם הטבע, והוא מנהיג הגאולה של המין האנושי כולו."
    },
    {
        name: "The Lovers",
        meaning_up: "Attraction, love, beauty, trials overcome.",
        desc: "The sun shines in the zenith, and beneath is a great winged figure with arms extended, pouring down influences. In the foreground are two human figures, male and female, unveiled before each other, as if Adam and Eve when they first occupied the paradise of the earthly body. Behind the man is the Tree of Life, bearing twelve fruits, and the Tree of the Knowledge of Good and Evil is behind the woman; the serpent is twining round it. The figures suggest youth, virginity, innocence and love before it is contaminated by gross material desire. This is in all simplicity the card of human love, here exhibited as part of the way, the truth and the life. It replaces, by recourse to first principles, the old card of marriage, which I have described previously, and the later follies which depicted man between vice and virtue. In a very high sense, the card is a mystery of the Covenant and Sabbath. The suggestion in respect of the woman is that she signifies that attraction towards the sensitive life which carries within it the idea of the Fall of Man, but she is rather the working of a Secret Law of Providence than a willing and conscious temptress.",
        meaning_up_he: "משיכה, אהבה, יופי, ניסיונות שהתגברו עליהם.",
        desc_he: "השמש זורחת בגובה השמיים, ומתחתיה דמות כנפיים גדולה, זרועותיה פרושות, יוצקת ברכה. בקדמת הקלף שתי דמויות אנוש, גבר ואישה, חשופות זו מול זו, כמו אדם וחוה בבואם ראשונה אל גן העדן הארצי. מאחורי הגבר עץ החיים, נושא שנים עשר פירות, ומאחורי האישה עץ הדעת טוב ורע, והנחש כרוך סביבו. הדמויות מבטאות נעורים, בתולים, תמימות ואהבה בטרם השחיתה אותם התשוקה הגשמית. זהו בפשטות המוחלטת קלף האהבה האנושית, המוצג כאן כחלק מן הדרך, מן האמת ומן החיים. הוא מחליף, בחזרה לעקרונות ראשונים, את קלף הנישואין הישן, שתיארתי קודם, ואת האיוולות המאוחרות שתיארו את האדם בין הרֶשע לצדקה. במובן נעלה מאוד, הקלף הוא מסתורין הברית והשבת. באשר לאישה, המשמעות היא שהיא מסמלת את המשיכה אל חיי החושים, הנושאת בתוכה את רעיון חטא האדם, אך היא בעיקר פעולתו של חוק סודי של ההשגחה, לא פיתוי מכוון ומודע."
    },
    {
        name: "The Chariot",
        meaning_up: "Succour, providence also war, triumph, presumption, vengeance, trouble.",
        desc: "An erect and princely figure carrying a drawn sword and corresponding, broadly speaking, to the traditional description which I have given in the first part. On the shoulders of the victorious hero are supposed to be the Urim and Thummim. He has led captivity captive; he is conquest on all planes--in the mind, in science, in progress, in certain trials of initiation. He has thus replied to the sphinx, and it is on this account that I have accepted the variation of Éliphas Lévi; two sphinxes thus draw his chariot. He is above all things triumph in the mind. It is to be understood for this reason that the question of the sphinx is concerned with a Mystery of Nature and not of the world of Grace, to which the charioteer could offer no answer; and that the planes of his conquest are manifest or external and not within himself; the liberation which he effects may leave himself in the bondage of the logical understanding.",
        meaning_up_he: "עזרה, השגחה; וכן מלחמה, ניצחון, יוהרה, נקמה, צרה.",
        desc_he: "דמות נסיכית וזקופה, אוחזת חרב שלופה, המתאימה, באורח כללי, לתיאור המסורתי. על כתפי הגיבור המנצח מונחים אורים ותומים כביכול. הוא הוליך שביה שבי; הוא ניצחון בכל המישורים – בשכל, במדע, בהתקדמות, בניסיונות חניכה מסוימים. כך השיב לחידת הספינקס, ועל כן קיבלתי את גרסתו של אליפס לוי – שני ספינקסים מושכים אפוא את מרכבתו. הוא מעל לכול ניצחון השכל. יש להבין מטעם זה שחידת הספינקס עוסקת במסתורי הטבע ולא בעולם החסד, אשר לו לא יכול היה בעל המרכבה להשיב; ומישורי ניצחונו גלויים וחיצוניים ולא פנימיים; השחרור שהוא מחולל עשוי להשאירו עצמו בכבלי ההיגיון."
    },
    {
        name: "Strength",
        meaning_up: "Power, energy, action, courage, magnanimity; also complete success and honours.",
        desc: "A woman, over whose head there broods the same symbol of life which we have seen in the card of the Magician, is closing the jaws of a lion. The only point in which this design differs from the conventional presentations is that her beneficent fortitude has already subdued the lion, which is being led by a chain of flowers. Fortitude, in one of its most exalted aspects, is connected with the Divine Mystery of Union; the virtue, of course, operates in all planes, and hence draws on all in its symbolism. It connects also with innocentia inviolata, and with the strength which resides in contemplation. The card has nothing to do with self-confidence in the ordinary sense, though this has been suggested--but it concerns the confidence of those whose strength is God, who have found their refuge in Him. There is one aspect in which the lion signifies the passions, and she who is called Strength is the higher nature in its liberation. It has walked upon the asp and the basilisk and has trodden down the lion and the dragon.",
        meaning_up_he: "עוצמה, אנרגיה, פעולה, אומץ, נדיבות לב; וכן הצלחה מלאה וכיבודים.",
        desc_he: "אישה, שמעל ראשה מרחף אותו סמל החיים שראינו בקלף הקוסם, סוגרת את לוע האריה. ההבדל היחיד מהעיצוב המקובל הוא שגבורתה המיטיבה כבר הכניעה את האריה, המובל בשרשרת פרחים. גבורה, באחד מהיבטיה הנעלים ביותר, קשורה למסתורין האלוהי של האיחוד; המידה, כמובן, פועלת בכל המישורים, ומכאן שואבת מכולם בסמליותה. היא מתחברת גם לתמימות שלא חוללה, ולעוצמה השוכנת בהתבוננות. לקלף אין דבר עם ביטחון עצמי במובן הרגיל, אף שכך הוצע – אלא הוא נוגע לביטחונם של מי שעוצמתם היא האל, שמצאו בו מחסה. יש היבט שבו האריה מסמל את התשוקות, וזו הנקראת עוצמה היא הטבע העליון בשחרורו. היא דרכה על הצפע והבזיליסק, ורמסה את האריה והתנין."
    },
    {
        name: "The Hermit",
        meaning_up: "Prudence, circumspection; also and especially treason, dissimulation, roguery, corruption.",
        desc: "The variation from the conventional models in this card is only that the lamp is not enveloped partially in the mantle of its bearer, who blends the idea of the Ancient of Days with the Light of the World. It is a star which shines in the lantern. I have said that this is a card of attainment, and to extend this conception the figure is seen holding up his beacon on an eminence. Therefore the Hermit is not, as Court de Gebelin explained, a wise man in search of truth and justice; nor is he, as a later explanation proposes, an especial example of experience. His beacon intimates that \"where I am, you also may be.\" It is further a card which is understood quite incorrectly when it is connected with the idea of occult isolation, as the protection of personal magnetism against admixture. In true Martinism, the significance of the term Philosophe inconnu was of another order--like the card itself--to the truth that the Divine Mysteries secure their own protection from those who are unprepared.",
        meaning_up_he: "זהירות, מתינות; וגם, ובעיקר, בגידה, העמדת פנים, נוכלות, שחיתות.",
        desc_he: "השינוי מן הדגם המקובל בקלף זה הוא רק שהפנס אינו עטוף חלקית באדרת נושאו, המשלב את רעיון עתיק היומין עם אור העולם. כוכב זוהר בתוך הפנס. אמרתי כי זהו קלף של השגה, ולהרחבת מושג זה נראית הדמות מחזיקה את אבוקתה מעל גבעה. לפיכך הנזיר אינו, כפי שהסביר קור דה ז'בלן, חכם המחפש אמת וצדק; ואינו, כפי שהציעה פרשנות מאוחרת יותר, דוגמה מיוחדת לניסיון חיים. אבוקתו מרמזת ש'במקום שבו אני נמצא, גם אתה יכול להיות'. זהו עוד קלף המובן שלא כהלכה כשמקשרים אותו לרעיון של בדידות נסתרת, כהגנה על המגנטיות האישית מפני תערובת. באמת המרטיניזם, משמעות המונח 'הפילוסוף הבלתי נודע' הייתה מסדר אחר – כמו הקלף עצמו – לאמת שהמסתורין האלוהיים מבטיחים את הגנתם שלהם מפני מי שאינם מוכנים."
    },
    {
        name: "Wheel of Fortune",
        meaning_up: "Destiny, fortune, success, elevation, luck, felicity.",
        desc: "In this symbol I have again followed the reconstruction of Éliphas Lévi, who has furnished several variants. It is legitimate to use Egyptian symbolism when this serves our purpose, provided that no theory of origin is implied therein. I have, however, presented Typhon in his serpent form. The symbolism is, of course, not exclusively Egyptian, as the four Living Creatures of Ezekiel occupy the angles of the card, and the wheel itself follows other indications of Lévi in respect of Ezekiel's vision, as illustrative of the particular Tarot Key. With the French occultist, and in the design itself, the symbolic picture stands for the perpetual motion of a fluidic universe and for the flux of human life. The Sphinx is the equilibrium therein. The transliteration of Taro as Rota is inscribed on the wheel, counterchanged with the letters of the Divine Name--to shew that Providence is implied through all. Behind the general notion expressed in the symbol there lies the denial of chance and the fatality which is implied therein.",
        meaning_up_he: "גורל, מזל, הצלחה, התעלות, מזל טוב, אושר.",
        desc_he: "בסמל זה הלכתי שוב בעקבות השחזור של אליפס לוי, שהציע כמה גרסאות. לגיטימי להשתמש בסמליות מצרית כשהיא משרתת את מטרתנו, ובלבד שאין הדבר מרמז על תיאוריית מקור כלשהי. עם זאת הצגתי את טיפון בצורת נחשו. הסמליות אינה כמובן מצרית בלבד, שכן ארבע החיות החיות של יחזקאל תופסות את זוויות הקלף, והגלגל עצמו הולך בעקבות רמזים נוספים של לוי בנוגע לחזון יחזקאל, כמדגים את מפתח הטארוט המסוים הזה. אצל האוקולטיסט הצרפתי, ובעיצוב עצמו, התמונה הסמלית מייצגת את התנועה הנצחית של יקום נוזלי ואת זרימת חיי האדם. הספינקס הוא שיווי המשקל שבתוכה. תעתיק המילה 'טארו' כ'רוֹטָה' חקוק על הגלגל, מנוגד לאותיות השם האלוהי – לרמז שההשגחה נרמזת בכול. מאחורי המושג הכללי המובע בסמל טמונה הכחשת המקריות והגורליות הנרמזת בה."
    },
    {
        name: "Justice",
        meaning_up: "Equity, rightness, probity, executive; triumph of the deserving side in law.",
        desc: "As this card follows the traditional symbolism and carries above all its obvious meanings, there is little to say regarding it outside the few considerations collected in the first part, to which the reader is referred. It will be seen, however, that the figure is seated between pillars, like the High Priestess, and on this account it seems desirable to indicate that the moral principle which deals unto every man according to his works--while, of course, it is in strict analogy with higher things--differs in its essence from the spiritual justice which is involved in the idea of election. The latter belongs to a mysterious order of Providence, in virtue of which it is possible for certain men to conceive the idea of dedication to the highest things. The law of Justice is not however involved by either alternative. In conclusion, the pillars of Justice open into one world and the pillars of the High Priestess into another.",
        meaning_up_he: "יושר, צדק, יושרה, כוח מבצע; ניצחון הצד הראוי בדין.",
        desc_he: "מאחר שקלף זה הולך בעקבות הסמליות המסורתית ונושא מעל לכול את משמעויותיו הברורות, אין הרבה להוסיף מעבר למספר הנקודות שנאספו בחלק הראשון. יוער עם זאת שהדמות יושבת בין עמודים, כמו הכוהנת הגדולה, ומטעם זה ראוי לציין שהעיקרון המוסרי הגומל לכל אדם כמעשיו – אף שהוא, כמובן, בהתאמה מלאה לדברים נעלים יותר – שונה במהותו מן הצדק הרוחני הכרוך ברעיון הבחירה. האחרון שייך לסדר מסתורי של השגחה, אשר מכוחו יכולים אנשים מסוימים להגות ברעיון ההקדשה לדברים העליונים ביותר. חוק הצדק אינו כרוך עם זאת באף אחת מן החלופות. לסיכום, עמודי הצדק נפתחים אל עולם אחד, ועמודי הכוהנת הגדולה אל עולם אחר."
    },
    {
        name: "The Hanged Man",
        meaning_up: "Wisdom, circumspection, discernment, trials, sacrifice, intuition, divination, prophecy.",
        desc: "The gallows from which he is suspended forms a Tau cross, while the figure--from the position of the legs--forms a fylfot cross. There is a nimbus about the head of the seeming martyr. It should be noted that the tree of sacrifice is living wood, with leaves thereon; that the face expresses deep entrancement, not suffering; and that the figure, as a whole, suggests life in suspension, but life and not death. It is a card of profound significance, but all the significance is veiled. It has been called falsely a card of martyrdom, a card of prudence, a card of the Great Work, a card of duty; but we may exhaust all published interpretations and find only vanity. I will say very simply on my own part that it expresses the relation, in one of its aspects, between the Divine and the Universe. He who can understand that the story of his higher nature is imbedded in this symbolism will receive intimations concerning a great awakening that is possible, and will know that after the sacred Mystery of Death there is a glorious Mystery of Resurrection.",
        meaning_up_he: "חוכמה, זהירות, תבונה, ניסיונות, קורבן, אינטואיציה, ניחוש, נבואה.",
        desc_he: "עמוד התלייה שממנו הוא תלוי יוצר צלב תי, בעוד הדמות – מתנוחת רגליה – יוצרת צלב עקום. הילה מקיפה את ראשו של המעונה כביכול. יש לציין שעץ הקורבן הוא עץ חי, ועליו נותרים עליו; שהבעת הפנים מבטאת קסם עמוק, לא סבל; ושהדמות כולה מרמזת על חיים בהשעיה, אך חיים ולא מוות. זהו קלף בעל משמעות עמוקה, אך כל משמעותו מוסתרת. כונה בטעות קלף קדושים מעונים, קלף זהירות, קלף המלאכה הגדולה, קלף חובה; אך נוכל למצות את כל הפרשנויות שפורסמו ולמצוא רק הבל. אומר בפשטות רבה מטעמי שהוא מבטא את היחס, באחד מהיבטיו, בין האלוהי ליקום. מי שיוכל להבין שסיפור טבעו הנעלה משוקע בסמליות זו יקבל רמזים על התעוררות גדולה האפשרית, וידע שאחרי מסתורי המוות הקדוש יש מסתורין מפואר של תחייה."
    },
    {
        name: "Death",
        meaning_up: "End, mortality, destruction, corruption also, for a man, the loss of a benefactor for a woman, many contrarieties; for a maid, failure of marriage projects.",
        desc: "The veil or mask of life is perpetuated in change, transformation and passage from lower to higher, and this is more fitly represented in the rectified Tarot by one of the apocalyptic visions than by the crude notion of the reaping skeleton. Behind it lies the whole world of ascent in the spirit. The mysterious horseman moves slowly, bearing a black banner emblazoned with the Mystic Rose, which signifies life. Between two pillars on the verge of the horizon there shines the sun of immortality. The horseman carries no visible weapon, but king and child and maiden fall before him, while a prelate with clasped hands awaits his end. The natural transit of man to the next stage of his being either is or may be one form of his progress, but the exotic and almost unknown entrance, while still in this life, into the state of mystical death is a change in the form of consciousness and the passage into a state to which ordinary death is neither the path nor gate. The existing occult explanations of the 13th card are, on the whole, better than usual, rebirth, creation, destination, renewal, and the rest.",
        meaning_up_he: "קץ, בני חלוף, הרס, השחתה; לגבר – אובדן מיטיב; לאישה – ניגודים רבים; לנערה – כישלון תוכניות נישואין.",
        desc_he: "מסכת החיים או צעיפם מונצחים בשינוי, בהתמרה ובמעבר מן הנמוך אל הגבוה, וזה מיוצג נכונה יותר בטארוט המתוקן באחד מחזונות ההתגלות מאשר ברעיון הגס של שלד הקוצר. מאחוריו טמון כל עולם העלייה שברוח. הפרש המסתורי נע לאט, נושא דגל שחור מעוטר בוורד המיסטי, המסמל חיים. בין שני עמודים בשולי האופק זורחת שמש הנצח. הפרש אינו נושא נשק גלוי, אך מלך וילד ונערה נופלים לפניו, בעוד כומר בכפות ידיים שלובות ממתין לקצו. המעבר הטבעי של האדם אל שלב קיומו הבא הוא, או עשוי להיות, צורה אחת בהתקדמותו, אך הכניסה הזרה והבלתי נודעת כמעט, בעודו בחיים אלה, אל מצב המוות המיסטי היא שינוי בצורת ההכרה ומעבר אל מצב שהמוות הרגיל אינו הדרך אליו ואף לא השער. ההסברים האוקולטיים הקיימים לקלף השלושה עשר טובים, בסך הכול, מן הרגיל: לידה מחדש, בריאה, יעד, התחדשות, וכן הלאה."
    },
    {
        name: "Temperance",
        meaning_up: "Economy, moderation, frugality, management, accommodation.",
        desc: "A winged angel, with the sign of the sun upon his forehead and on his breast the square and triangle of the septenary. It is held to be pouring the essences of life from chalice to chalice. It has one foot upon the earth and one upon waters, thus illustrating the nature of the essences. A direct path goes up to certain heights on the verge of the horizon, and above there is a great light, through which a crown is seen vaguely. Hereof is some part of the Secret of Eternal Life, as it is possible to man in his incarnation. It is called Temperance fantastically, because, when the rule of it obtains in our consciousness, it tempers, combines and harmonises the psychic and material natures. Under that rule we know in our rational part something of whence we came and whither we are going.",
        meaning_up_he: "חיסכון, מתינות, צניעות, ניהול, התאמה.",
        desc_he: "מלאך כנוף, עם סימן השמש על מצחו ועל חזהו הריבוע והמשולש של השביעייה. הוא נראה יוצק את מהויות החיים מגביע לגביע. רגל אחת לו על היבשה ואחת על המים, ובכך מדגים את טבע המהויות. שביל ישיר עולה אל גבהים מסוימים בשולי האופק, ומעליו אור גדול, שדרכו נראה בעמימות כתר. כאן טמון חלק ממסתורין החיים הנצחיים, ככל שהוא אפשרי לאדם בגלגולו. נקרא מתינות באורח דמיוני, כי כאשר חוקה שולט בהכרתנו, הוא ממתן, משלב ומהרמן את הטבעים הנפשיים והחומריים. תחת אותו חוק אנו יודעים בחלקנו הרציונלי משהו מאין באנו ולאן אנו הולכים."
    },
    {
        name: "The Devil",
        meaning_up: "Ravage, violence, vehemence, extraordinary efforts, force, fatality; that which is predestined but is not for this reason evil.",
        desc: "The Horned Goat of Mendes, with wings like those of a bat, is standing on an altar. At the pit of the stomach there is the sign of Mercury. The right hand is upraised and extended, being the reverse of that benediction which is given by the Hierophant in the fifth card. In the left hand there is a great flaming torch, inverted towards the earth. A reversed pentagram is on the forehead. There is a ring in front of the altar, from which two chains are carried to the necks of two figures, male and female. These are analogous with those of the fifth card, as if Adam and Eve after the Fall. Hereof is the chain and fatality of the material life. The figures are tailed, to signify the animal nature, but there is human intelligence in the faces, and he who is exalted above them is not to be their master for ever. Even now, he is also a bondsman, sustained by the evil that is in him and blind to the liberty of service.",
        meaning_up_he: "חורבן, אלימות, עוצמה תוקפנית, מאמצים יוצאי דופן, כוח, גזירת גורל; מה שנקבע מראש אך אינו רע רק בשל כך.",
        desc_he: "עז מנדס הקרנית, בעלת כנפי עטלף, עומדת על מזבח. בבטנה סימן כוכב חמה. ידה הימנית מורמת ופרושה, היפוכה של הברכה שנותן ההיירופנט בקלף החמישי. בידה השמאלית אבוקה גדולה בוערת, הפוכה כלפי האדמה. פנטגרם הפוך על מצחה. טבעת לפני המזבח, שממנה שני שרשראות נמשכות לצווארי שתי דמויות, גבר ואישה. אלה דומות לאלה שבקלף החמישי, כאדם וחוה לאחר החטא. כאן טמונה שרשרת חיי החומר וגזירתם. לדמויות זנבות, לרמז על הטבע הבהמי, אך יש תבונה אנושית בפניהן, ומי שמתנשא מעליהן לא יהיה אדונן לנצח. גם עתה הוא עצמו כפות, נתמך על ידי הרוע שבו, ועיוור לחירות שבשירות."
    },
    {
        name: "The Tower",
        meaning_up: "Misery, distress, indigence, adversity, calamity, disgrace, deception, ruin. It is a card in particular of unforeseen catastrophe.",
        desc: "Occult explanations attached to this card are meagre and mostly disconcerting. It is idle to indicate that it depicts ruin in all its aspects, because it bears this evidence on the surface. I agree rather with Grand Orient that it is the ruin of the House of We, when evil has prevailed therein, and above all that it is the rending of a House of Doctrine. I understand that the reference is, however, to a House of Falsehood. It illustrates also in the most comprehensive way the old truth that \"except the Lord build the house, they labour in vain that build it.\" There is a sense in which the catastrophe is a reflection from the previous card, but not on the side of the symbolism which I have tried to indicate therein. It is more correctly a question of analogy; one is concerned with the fall into the material and animal state, while the other signifies destruction on the intellectual side. The Tower has been spoken of as the chastisement of pride and the intellect overwhelmed in the attempt to penetrate the Mystery of God.",
        meaning_up_he: "עוני, מצוקה, מחסור, צרה, אסון, חרפה, אכזבה, חורבן. קלף זה במיוחד מציין אסון בלתי צפוי.",
        desc_he: "ההסברים האוקולטיים הנלווים לקלף זה דלים ולרוב מבלבלים. אין טעם לציין שהוא מתאר חורבן על כל היבטיו, שכן הדבר ניכר על פני השטח. אני נוטה להסכים עם 'גרנד אוריינט' שזהו חורבן בית האדם, כאשר הרוע שרר בו, ומעל לכול – קריעתו של בית התורה. אני מבין שהכוונה היא לבית השקר. הוא ממחיש גם, באופן המקיף ביותר, את האמת הישנה כי 'אם ה' לא יבנה בית – שווא עמלו בוניו'. יש מובן שבו האסון הוא השתקפות מן הקלף הקודם, אך לא בצד הסמליות שניסיתי להראות שם. זו יותר שאלה של אנלוגיה; האחד עוסק בנפילה אל מצב חומרי ובהמי, בעוד האחר מסמן הרס בצד השכלי. המגדל תואר כעונש הגאווה והשכל שנמחץ בניסיון לחדור למסתורי האל."
    },
    {
        name: "The Star",
        meaning_up: "Loss, theft, privation, abandonment; another reading says hope and bright prospects.",
        desc: "A great, radiant star of eight rays, surrounded by seven lesser stars--also of eight rays. The female figure in the foreground is entirely naked. Her left knee is on the land and her right foot upon the water. She pours Water of Life from two great ewers, irrigating sea and land. Behind her is rising ground and on the right a shrub or tree, whereon a bird alights. The figure expresses eternal youth and beauty. The star is l'étoile flamboyante, which appears in Masonic symbolism. That which the figure communicates to the living scene is the substance of the heavens and the elements. It has been said truly that the mottoes of this card are \"Waters of Life freely\" and \"Gifts of the Spirit.\" The summary of several tawdry explanations says that it is a card of hope. On other planes it has been certified as immortality and interior light. For the majority of prepared minds, the figure will appear as the type of Truth unveiled, glorious in undying beauty, pouring on the waters of the soul some part and measure of her priceless possession.",
        meaning_up_he: "אובדן, גניבה, מחסור, נטישה; ולפי קריאה אחרת – תקווה וסיכויים בהירים.",
        desc_he: "כוכב גדול וזוהר בעל שמונה קרניים, מוקף בשבעה כוכבים קטנים יותר – גם הם בעלי שמונה קרניים. הדמות הנשית בקדמת הקלף עירומה כליל. ברכה השמאלית על היבשה וכף רגלה הימנית על המים. היא יוצקת מים חיים משני כדים גדולים, משקה ים ויבשה. מאחוריה עלייה בקרקע, ומימין שיח או עץ שעליו נוחתת ציפור. הדמות מבטאת נעורים נצחיים ויופי. הכוכב הוא 'הכוכב הבוער' המופיע בסמליות המסונית. את שהדמות מעבירה אל הזירה החיה הוא מהות השמיים והיסודות. נאמר בצדק שסיסמאות הקלף הן 'מי חיים בחינם' ו'מתנות הרוח'. תמצית פרשנויות רבות ורדודות אומרת שזהו קלף תקווה. במישורים אחרים הוא הוגדר כאלמוות ואור פנימי. עבור רוב הנפשות המוכנות, הדמות תיראה כדגם האמת חשופה מכסות, נהדרת ביופי שאינו נס, יוצקת על מי הנשמה חלק וּמידה ממאגר עוצרה שלא יסולא בפז."
    },
    {
        name: "The Moon",
        meaning_up: "Hidden enemies, danger, calumny, darkness, terror, deception, occult forces, error.",
        desc: "The distinction between this card and some of the conventional types is that the moon is increasing on what is called the side of mercy, to the right of the observer. It has sixteen chief and sixteen secondary rays. The card represents life of the imagination apart from life of the spirit. The path between the towers is the issue into the unknown. The dog and wolf are the fears of the natural mind in the presence of that place of exit, when there is only reflected light to guide it. The intellectual light is a reflection and beyond it is the unknown mystery which it cannot shew forth. It illuminates our animal nature, types of which are represented below--the dog, the wolf and that which comes up out of the deeps, the nameless and hideous tendency which is lower than the savage beast. It strives to attain manifestation, symbolized by crawling from the abyss of water to the land, but as a rule it sinks back whence it came.",
        meaning_up_he: "אויבים נסתרים, סכנה, עלילת שווא, חשכה, אימה, הונאה, כוחות נסתרים, טעות.",
        desc_he: "ההבדל בין קלף זה לכמה מן הדגמים המקובלים הוא שהירח מתגבר בצד המכונה צד הרחמים, מימין למתבונן. יש לו שש עשרה קרניים עיקריות ושש עשרה משניות. הקלף מייצג את חיי הדמיון בנפרד מחיי הרוח. השביל בין המגדלים הוא היציאה אל הבלתי נודע. הכלב והזאב הם פחדי השכל הטבעי לנוכח מקום יציאה זה, כשרק אור מוחזר מדריך אותו. האור השכלי הוא השתקפות, ומעברו טמון המסתורין הבלתי נודע שאין הוא יכול לגלותו. הוא מאיר את טבענו הבהמי, שדוגמאות לו מוצגות למטה – הכלב, הזאב, ומה שעולה מן המעמקים, הנטייה חסרת השם והמכוערת הנמוכה אף מן החיה הפרימיטיבית. היא שואפת להגיע לידי ביטוי, המסומל בזחילה מתהום המים אל היבשה, אך על פי רוב שוקעת חזרה למקורה."
    },
    {
        name: "The Sun",
        meaning_up: "Material happiness, fortunate marriage, contentment.",
        desc: "The naked child mounted on a white horse and displaying a red standard has been mentioned already as the better symbolism connected with this card. It is the destiny of the Supernatural East and the great and holy light which goes before the endless procession of humanity, coming out from the walled garden of the sensitive life and passing on the journey home. The card signifies, therefore, the transit from the manifest light of this world, represented by the glorious sun of earth, to the light of the world to come, which goes before aspiration and is typified by the heart of a child. The sun is that of consciousness in the spirit--the direct as the antithesis of the reflected light. The characteristic type of humanity has become a little child therein--a child in the sense of simplicity and innocence in the sense of wisdom. In that simplicity, he bears the seal of Nature and of Art; in that innocence, he signifies the restored world.",
        meaning_up_he: "אושר חומרי, נישואין מוצלחים, שביעות רצון.",
        desc_he: "הילד העירום הרכוב על סוס לבן ונושא דגל אדום הוזכר כבר כסמליות המשופרת הקשורה לקלף זה. זהו גורלו של המזרח העל-טבעי והאור הגדול והקדוש ההולך לפני התהלוכה האינסופית של האנושות, היוצאת מגן החושים המוקף חומה ופוסעת בדרך הביתה. הקלף מסמן אפוא את המעבר מהאור הגלוי של עולם זה, המיוצג על ידי שמש הארץ המפוארת, אל אור העולם הבא, ההולך לפני השאיפה ומסומל בלב ילד. השמש היא זו של ההכרה שברוח – הישיר, כניגוד לאור המוחזר. הטיפוס האופייני של האנושות הפך שם לילד קטן – ילד במובן הפשטות והתמימות במובן החוכמה. בפשטות זו הוא נושא את חותם הטבע והאמנות; בתמימות זו הוא מסמל את העולם המושב."
    },
    {
        name: "Judgement",
        meaning_up: "Change of position, renewal, outcome. Another account specifies total loss though lawsuit.",
        desc: "The great angel is here encompassed by clouds, but he blows his bannered trumpet, and the cross as usual is displayed on the banner. The dead are rising from their tombs--a woman on the right, a man on the left hand, and between them their child, whose back is turned. But in this card there are more than three who are restored, and it has been thought worth while to make this variation as illustrating the insufficiency of current explanations. It should be noted that all the figures are as one in the wonder, adoration and ecstacy expressed by their attitudes. It is the card which registers the accomplishment of the great work of transformation in answer to the summons of the Supernal--which summons is heard and answered from within. Herein is the intimation of a significance which cannot well be carried further in the present place. What is that within us which does sound a trumpet and all that is lower in our nature rises in response--almost in a moment, almost in the twinkling of an eye?",
        meaning_up_he: "שינוי מעמד, התחדשות, תוצאה. גרסה אחרת מציינת אובדן מוחלט בעקבות תביעה משפטית.",
        desc_he: "המלאך הגדול מוקף כאן בעננים, אך הוא תוקע בחצוצרתו המדוגלת, והצלב כרגיל מופיע על הדגל. המתים קמים מקבריהם – אישה מימין, גבר משמאל, וביניהם ילדם, גבו פונה אלינו. אך בקלף זה יש יותר משלושה המושבים, ונראה לנכון לערוך שינוי זה כדי להמחיש את אי-ההספקה שבפרשנויות הרווחות. יש לציין שכל הדמויות כאחת בפליאה, בהערצה ובאקסטזה המובעות בתנוחתן. זהו הקלף המתעד את השלמת המלאכה הגדולה של התמרה במענה לקריאת העליון – קריאה הנשמעת ונענית מבפנים. כאן טמון רמז למשמעות שלא ניתן להרחיבה במקום זה. מהו אותו דבר בתוכנו התוקע בחצוצרה, וכל מה שנמוך בטבענו קם לתשובה – כמעט ברגע, כהרף עין?"
    },
    {
        name: "The World",
        meaning_up: "Assured success, recompense, voyage, route, emigration, flight, change of place.",
        desc: "As this final message of the Major Trumps is unchanged--and indeed unchangeable--in respect of its design, it has been partly described already regarding its deeper sense. It represents also the perfection and end of the Cosmos, the secret which is within it, the rapture of the universe when it understands itself in God. It is further the state of the soul in the consciousness of Divine Vision, reflected from the self-knowing spirit. It has more than one message on the macrocosmic side and is, for example, the state of the restored world when the law of manifestation shall have been carried to the highest degree of natural perfection. But it is perhaps more especially a story of the past, referring to that day when all was declared to be good, when the morning stars sang together and all the Sons of God shouted for joy. One of the worst explanations concerning it is that the figure symbolizes the Magus when he has reached the highest degree of initiation; another account says that it represents the absolute, which is ridiculous. The figure has been said to stand for Truth, which is, however, more properly allocated to the seventeenth card.",
        meaning_up_he: "הצלחה מובטחת, תגמול, מסע, דרך, הגירה, בריחה, שינוי מקום.",
        desc_he: "מאחר שמסר סופי זה של הקלפים הגדולים אינו משתנה – ואף אינו ניתן לשינוי – בעיצובו, כבר תואר בחלקו בנוגע למשמעותו העמוקה יותר. הוא מייצג גם את שלמות היקום וקִצו, את הסוד הטמון בו, את התלהבות היקום כשהוא מבין את עצמו באל. הוא עוד מצב הנפש בהכרת החזון האלוהי, המשתקף מן הרוח יודעת-עצמה. יש לו יותר ממסר אחד בצד המקרוקוסמי, והוא, למשל, מצב העולם המושב כאשר חוק ההתגלות יגיע לדרגה הגבוהה ביותר של שלמות טבעית. אך אולי הוא בעיקר סיפור מן העבר, המתייחס לאותו יום שבו נאמר שהכול טוב, כשכוכבי הבוקר שרו יחדיו וכל בני האלוהים הריעו בשמחה. אחד ההסברים הגרועים ביותר לגביו הוא שהדמות מסמלת את המאגוס בהגיעו לדרגת החניכה הגבוהה ביותר; גרסה אחרת אומרת שהוא מייצג את המוחלט, וזה מגוחך. נאמר על הדמות שהיא מסמלת אמת, אך זו שייכת יותר לקלף השבעה עשר."
    },

    // ── CUPS ──────────────────────────────────────────────────────────────────
    {
        name: "Ace of Cups",
        meaning_up: "House of the true heart, joy, content, abode, nourishment, abundance, fertility; Holy Table, felicity hereof.",
        desc: "The waters are beneath, and thereon are water-lilies; the hand issues from the cloud, holding in its palm the cup, from which four streams are pouring; a dove, bearing in its bill a cross-marked Host, descends to place the Wafer in the Cup; the dew of water is falling on all sides. It is an intimation of that which may lie behind the Lesser Arcana."
    },
    {
        name: "Two of Cups",
        meaning_up: "Love, passion, friendship, affinity, union, concord, sympathy, the interrelation of the sexes, and--as a suggestion apart from all offices of divination--that desire which is not in Nature, but by which Nature is sanctified.",
        desc: "A youth and maiden are pledging one another, and above their cups rises the Caduceus of Hermes, between the great wings of which there appears a lion's head. It is a variant of a sign which is found in a few old examples of this card. Some curious emblematical meanings are attached to it, but they do not concern us in this place."
    },
    {
        name: "Three of Cups",
        meaning_up: "The conclusion of any matter in plenty, perfection and merriment; happy issue, victory, fulfilment, solace, healing.",
        desc: "Maidens in a garden-ground with cups uplifted, as if pledging one another."
    },
    {
        name: "Four of Cups",
        meaning_up: "Weariness, disgust, aversion, imaginary vexations, as if the wine of this world had caused satiety only; another wine, as if a fairy gift, is now offered the wastrel, but he sees no consolation therein. This is also a card of blended pleasure.",
        desc: "A young man is seated under a tree and contemplates three cups set on the grass before him; an arm issuing from a cloud offers him another cup. His expression notwithstanding is one of discontent with his environment."
    },
    {
        name: "Five of Cups",
        meaning_up: "It is a card of loss, but something remains over; three have been taken, but two are left; it is a card of inheritance, patrimony, transmission, but not corresponding to expectations; with some interpreters it is a card of marriage, but not without bitterness or frustration.",
        desc: "A dark, cloaked figure, looking sideways at three prone cups two others stand upright behind him; a bridge is in the background, leading to a small keep or holding. It is a card of loss, but something remains over; three have been taken, but two are left; it is a card of inheritance, patrimony, transmission, but not corresponding to expectations; with some interpreters it is a card of marriage, but not without bitterness or frustration."
    },
    {
        name: "Six of Cups",
        meaning_up: "A card of the past and of memories, looking back, as--for example--on childhood; happiness, enjoyment, but coming rather from the past; things that have vanished. Another reading reverses this, giving new relations, new knowledge, new environment.",
        desc: "Children in an old garden, their cups filled with flowers."
    },
    {
        name: "Seven of Cups",
        meaning_up: "Fairy favours, images of reflection, sentiment, imagination, things seen in the glass of contemplation; some attainment in these degrees, but nothing permanent or substantial is suggested.",
        desc: "Strange chalices of vision, but the images are more especially those of the fantastic spirit."
    },
    {
        name: "Eight of Cups",
        meaning_up: "The card speaks for itself on the surface, but other readings are entirely antithetical--giving joy, mildness, timidity, honour, modesty. In practice, it is usually found that the card shews the decline of a matter, or that a matter which has been thought to be important is really of slight consequence--either for good or evil.",
        desc: "A man of dejected aspect is deserting the cups of his felicity, enterprise, undertaking or previous concern."
    },
    {
        name: "Nine of Cups",
        meaning_up: "Concord, contentment, physical bien-être; also victory, success, advantage; satisfaction for the Querent or person for whom the consultation is made.",
        desc: "A goodly personage has feasted to his heart's content, and abundant refreshment of wine is on the arched counter behind him, seeming to indicate that the future is also assured. The picture offers the material side only, but there are other aspects."
    },
    {
        name: "Ten of Cups",
        meaning_up: "Contentment, repose of the entire heart; the perfection of that state; also perfection of human love and friendship; if with several picture-cards, a person who is taking charge of the Querent's interests; also the town, village or country inhabited by the Querent.",
        desc: "Appearance of Cups in a rainbow; it is contemplated in wonder and ecstacy by a man and woman below, evidently husband and wife. His right arm is about her; his left is raised upward; she raises her right arm. The two children dancing near them have not observed the prodigy but are happy after their own manner. There is a home-scene beyond."
    },
    {
        name: "Page of Cups",
        meaning_up: "Fair young man, one impelled to render service and with whom the Querent will be connected; a studious youth; news, message; application, reflection, meditation; also these things directed to business.",
        desc: "A fair, pleasing, somewhat effeminate page, of studious and intent aspect, contemplates a fish rising from a cup to look at him. It is the pictures of the mind taking form."
    },
    {
        name: "Knight of Cups",
        meaning_up: "Arrival, approach--sometimes that of a messenger; advances, proposition, demeanour, invitation, incitement.",
        desc: "Graceful, but not warlike; riding quietly, wearing a winged helmet, referring to those higher graces of the imagination which sometimes characterize this card. He too is a dreamer, but the images of the side of sense haunt him in his vision."
    },
    {
        name: "Queen of Cups",
        meaning_up: "Good, fair woman; honest, devoted woman, who will do service to the Querent; loving intelligence, and hence the gift of vision; success, happiness, pleasure; also wisdom, virtue; a perfect spouse and a good mother.",
        desc: "Beautiful, fair, dreamy--as one who sees visions in a cup. This is, however, only one of her aspects; she sees, but she also acts, and her activity feeds her dream."
    },
    {
        name: "King of Cups",
        meaning_up: "Fair man, man of business, law, or divinity; responsible, disposed to oblige the Querent; also equity, art and science, including those who profess science, law and art; creative intelligence.",
        desc: "He holds a short sceptre in his left hand and a great cup in his right; his throne is set upon the sea; on one side a ship is riding and on the other a dolphin is leaping. The implicit is that the Sign of the Cup naturally refers to water, which appears in all the court cards."
    },

    // ── SWORDS ────────────────────────────────────────────────────────────────
    {
        name: "Ace of Swords",
        meaning_up: "Triumph, the excessive degree in everything, conquest, triumph of force. It is a card of great force, in love as well as in hatred. The crown may carry a much higher significance than comes usually within the sphere of fortune-telling.",
        desc: "A hand issues from a cloud, grasping a sword, the point of which is encircled by a crown."
    },
    {
        name: "Two of Swords",
        meaning_up: "Conformity and the equipoise which it suggests, courage, friendship, concord in a state of arms; another reading gives tenderness, affection, intimacy. The suggestion of harmony and other favourable readings must be considered in a qualified manner, as Swords generally are not symbolical of beneficent forces in human affairs.",
        desc: "A hoodwinked female figure balances two swords upon her shoulders."
    },
    {
        name: "Three of Swords",
        meaning_up: "Removal, absence, delay, division, rupture, dispersion, and all that the design signifies naturally, being too simple and obvious to call for specific enumeration.",
        desc: "Three swords piercing a heart; cloud and rain behind."
    },
    {
        name: "Four of Swords",
        meaning_up: "Vigilance, retreat, solitude, hermit's repose, exile, tomb and coffin. It is these last that have suggested the design.",
        desc: "The effigy of a knight in the attitude of prayer, at full length upon his tomb."
    },
    {
        name: "Five of Swords",
        meaning_up: "Degradation, destruction, revocation, infamy, dishonour, loss, with the variants and analogues of these.",
        desc: "A disdainful man looks after two retreating and dejected figures. Their swords lie upon the ground. He carries two others on his left shoulder, and a third sword is in his right hand, point to earth. He is the master in possession of the field."
    },
    {
        name: "Six of Swords",
        meaning_up: "Journey by water, route, way, envoy, commissionary, expedient.",
        desc: "A ferryman carrying passengers in his punt to the further shore. The course is smooth, and seeing that the freight is light, it may be noted that the work is not beyond his strength."
    },
    {
        name: "Seven of Swords",
        meaning_up: "Design, attempt, wish, hope, confidence; also quarrelling, a plan that may fail, annoyance. The design is uncertain in its import, because the significations are widely at variance with each other.",
        desc: "A man in the act of carrying away five swords rapidly; the two others of the card remain stuck in the ground. A camp is close at hand."
    },
    {
        name: "Eight of Swords",
        meaning_up: "Bad news, violent chagrin, crisis, censure, power in trammels, conflict, calumny; also sickness.",
        desc: "A woman, bound and hoodwinked, with the swords of the card about her. Yet it is rather a card of temporary durance than of irretrievable bondage."
    },
    {
        name: "Nine of Swords",
        meaning_up: "Death, failure, miscarriage, delay, deception, disappointment, despair.",
        desc: "One seated on her couch in lamentation, with the swords over her. She is as one who knows no sorrow which is like unto hers. It is a card of utter desolation."
    },
    {
        name: "Ten of Swords",
        meaning_up: "Whatsoever is intimated by the design; also pain, affliction, tears, sadness, desolation. It is not especially a card of violent death.",
        desc: "A prostrate figure, pierced by all the swords belonging to the card."
    },
    {
        name: "Page of Swords",
        meaning_up: "Authority, overseeing, secret service, vigilance, spying, examination, and the qualities thereto belonging.",
        desc: "A lithe, active figure holds a sword upright in both hands, while in the act of swift walking. He is passing over rugged land, and about his way the clouds are collocated wildly. He is alert and lithe, looking this way and that, as if an expected enemy might appear at any moment."
    },
    {
        name: "Knight of Swords",
        meaning_up: "Skill, bravery, capacity, defence, address, enmity, wrath, war, destruction, opposition, resistance, ruin. There is therefore a sense in which the card signifies death, but it carries this meaning only in its proximity to other cards of fatality.",
        desc: "He is riding in full course, as if scattering his enemies. In the design he is really a prototypical hero of romantic chivalry. He might almost be Galahad, whose sword is swift and sure because he is clean of heart."
    },
    {
        name: "Queen of Swords",
        meaning_up: "Widowhood, female sadness and embarrassment, absence, sterility, mourning, privation, separation.",
        desc: "Her right hand raises the weapon vertically and the hilt rests on an arm of her royal chair the left hand is extended, the arm raised her countenance is severe but chastened; it suggests familiarity with sorrow. It does not represent mercy, and, her sword notwithstanding, she is scarcely a symbol of power."
    },
    {
        name: "King of Swords",
        meaning_up: "Whatsoever arises out of the idea of judgment and all its connexions-power, command, authority, militant intelligence, law, offices of the crown, and so forth.",
        desc: "He sits in judgment, holding the unsheathed sign of his suit. He recalls, of course, the conventional Symbol of justice in the Trumps Major, and he may represent this virtue, but he is rather the power of life and death, in virtue of his office."
    },

    // ── WANDS ─────────────────────────────────────────────────────────────────
    {
        name: "Ace of Wands",
        meaning_up: "Creation, invention, enterprise, the powers which result in these; principle, beginning, source; birth, family, origin, and in a sense the virility which is behind them; the starting point of enterprises; according to another account, money, fortune, inheritance.",
        desc: "A hand issuing from a cloud grasps a stout wand or club."
    },
    {
        name: "Two of Wands",
        meaning_up: "Between the alternative readings there is no marriage possible; on the one hand, riches, fortune, magnificence; on the other, physical suffering, disease, chagrin, sadness, mortification. The design gives one suggestion; here is a lord overlooking his dominion and alternately contemplating a globe; it looks like the malady, the mortification, the sadness of Alexander amidst the grandeur of this world's wealth.",
        desc: "A tall man looks from a battlemented roof over sea and shore; he holds a globe in his right hand, while a staff in his left rests on the battlement; another is fixed in a ring. The Rose and Cross and Lily should be noticed on the left side."
    },
    {
        name: "Three of Wands",
        meaning_up: "He symbolizes established strength, enterprise, effort, trade, commerce, discovery; those are his ships, bearing his merchandise, which are sailing over the sea. The card also signifies able co-operation in business, as if the successful merchant prince were looking from his side towards yours with a view to help you.",
        desc: "A calm, stately personage, with his back turned, looking from a cliff's edge at ships passing over the sea. Three staves are planted in the ground, and he leans slightly on one of them."
    },
    {
        name: "Four of Wands",
        meaning_up: "They are for once almost on the surface--country life, haven of refuge, a species of domestic harvest-home, repose, concord, harmony, prosperity, peace, and the perfected work of these.",
        desc: "From the four great staves planted in the foreground there is a great garland suspended; two female figures uplift nosegays; at their side is a bridge over a moat, leading to an old manorial house."
    },
    {
        name: "Five of Wands",
        meaning_up: "Imitation, as, for example, sham fight, but also the strenuous competition and struggle of the search after riches and fortune. In this sense it connects with the battle of life. Hence some attributions say that it is a card of gold, gain, opulence.",
        desc: "A posse of youths, who are brandishing staves, as if in sport or strife. It is mimic warfare, and hereto correspond the diverse readings of the card."
    },
    {
        name: "Six of Wands",
        meaning_up: "The card has been so designed that it can cover several significations; on the surface, it is a victor triumphing, but it is also great news, such as might be carried in state by the King's courier; it is expectation crowned with its own desire, the crown of hope, and so forth.",
        desc: "A laurelled horseman bears one staff adorned with a laurel crown; footmen with staves are at his side."
    },
    {
        name: "Seven of Wands",
        meaning_up: "It is a card of valour, for, on the surface, six are attacking one, who has, however, the vantage position. On the intellectual plane, it signifies discussion, wordy strife; in business--negotiations, war of trade, barter, competition. It is further a card of success, for the combatant is on the top and his enemies may be unable to reach him.",
        desc: "A young man on a craggy eminence brandishing a staff; six other staves are raised towards him from below."
    },
    {
        name: "Eight of Wands",
        meaning_up: "Activity in undertakings, the path of such activity, swiftness, as that of an express messenger; great haste, great hope, speed towards an end which promises assured felicity; generally, that which is on the move; also the arrows of love.",
        desc: "The card represents motion through the immovable-a flight of wands through an open country; but they draw to the term of their course. That which they signify is at hand; it may be even on the threshold."
    },
    {
        name: "Nine of Wands",
        meaning_up: "The card signifies strength in opposition. If attacked, the person will meet an onslaught boldly; and his build shews, that he may prove a formidable antagonist. With this main significance there are all its possible adjuncts--delay, suspension, adjournment.",
        desc: "The figure leans upon his staff and has an expectant look, as if awaiting an enemy. Behind are eight other staves--erect, in orderly disposition, like a palisade."
    },
    {
        name: "Ten of Wands",
        meaning_up: "A card of many significances, and some of the readings cannot be harmonized. The chief meaning is oppression simply, but it is also fortune, gain, any kind of success, and then it is the oppression of these things. It is also a card of false-seeming, disguise, perfidy.",
        desc: "A man oppressed by the weight of the ten staves which he is carrying."
    },
    {
        name: "Page of Wands",
        meaning_up: "Dark young man, faithful, a lover, an envoy, a postman. Beside a man, he will bear favourable testimony concerning him. A dangerous rival, if followed by the Page of Cups. Has the chief qualities of his suit. He may signify family intelligence.",
        desc: "In a scene similar to the former, a young man stands in the act of proclamation. He is unknown but faithful, and his tidings are strange."
    },
    {
        name: "Knight of Wands",
        meaning_up: "Departure, absence, flight, emigration. A dark young man, friendly. Change of residence.",
        desc: "He is shewn as if upon a journey, armed with a short wand, and although mailed is not on a warlike errand. He is passing mounds or pyramids. The motion of the horse is a key to the character of its rider, and suggests the precipitate mood, or things connected therewith."
    },
    {
        name: "Queen of Wands",
        meaning_up: "A dark woman, countrywoman, friendly, chaste, loving, honourable. If the card beside her signifies a man, she is well disposed towards him; if a woman, she is interested in the Querent. Also, love of money, or a certain success in business.",
        desc: "The Wands throughout this suit are always in leaf, as it is a suit of life and animation. Emotionally and otherwise, the Queen's personality corresponds to that of the King, but is more magnetic."
    },
    {
        name: "King of Wands",
        meaning_up: "Dark man, friendly, countryman, generally married, honest and conscientious. The card always signifies honesty, and may mean news concerning an unexpected heritage to fall in before very long.",
        desc: "The physical and emotional nature to which this card is attributed is dark, ardent, lithe, animated, impassioned, noble. The King uplifts a flowering wand, and wears, like his three correspondences in the remaining suits, what is called a cap of maintenance beneath his crown. He connects with the symbol of the lion, which is emblazoned on the back of his throne."
    },

    // ── PENTACLES ─────────────────────────────────────────────────────────────
    {
        name: "Ace of Pentacles",
        meaning_up: "Perfect contentment, felicity, ecstasy; also speedy intelligence; gold.",
        desc: "A hand--issuing, as usual, from a cloud--holds up a pentacle."
    },
    {
        name: "Two of Pentacles",
        meaning_up: "On the one hand it is represented as a card of gaiety, recreation and its connexions, which is the subject of the design; but it is read also as news and messages in writing, as obstacles, agitation, trouble, embroilment.",
        desc: "A young man, in the act of dancing, has a pentacle in either hand, and they are joined by that endless cord which is like the number 8 reversed."
    },
    {
        name: "Three of Pentacles",
        meaning_up: "Métier, trade, skilled labour; usually, however, regarded as a card of nobility, aristocracy, renown, glory.",
        desc: "A sculptor at his work in a monastery. Compare the design which illustrates the Eight of Pentacles. The apprentice or amateur therein has received his reward and is now at work in earnest."
    },
    {
        name: "Four of Pentacles",
        meaning_up: "The surety of possessions, cleaving to that which one has, gift, legacy, inheritance.",
        desc: "A crowned figure, having a pentacle over his crown, clasps another with hands and arms; two pentacles are under his feet. He holds to that which he has."
    },
    {
        name: "Five of Pentacles",
        meaning_up: "The card foretells material trouble above all, whether in the form illustrated--that is, destitution--or otherwise. For some cartomancists, it is a card of love and lovers-wife, husband, friend, mistress; also concordance, affinities.",
        desc: "Two mendicants in a snow-storm pass a lighted casement."
    },
    {
        name: "Six of Pentacles",
        meaning_up: "Presents, gifts, gratification another account says attention, vigilance now is the accepted time, present prosperity, etc.",
        desc: "A person in the guise of a merchant weighs money in a pair of scales and distributes it to the needy and distressed. It is a testimony to his own success in life, as well as to his goodness of heart."
    },
    {
        name: "Seven of Pentacles",
        meaning_up: "These are exceedingly contradictory; in the main, it is a card of money, business, barter; but one reading gives altercation, quarrels--and another innocence, ingenuity, purgation.",
        desc: "A young man, leaning on his staff, looks intently at seven pentacles attached to a clump of greenery on his right; one would say that these were his treasures and that his heart was there."
    },
    {
        name: "Eight of Pentacles",
        meaning_up: "Work, employment, commission, craftsmanship, skill in craft and business, perhaps in the preparatory stage.",
        desc: "An artist in stone at his work, which he exhibits in the form of trophies."
    },
    {
        name: "Nine of Pentacles",
        meaning_up: "Prudence, safety, success, accomplishment, certitude, discernment.",
        desc: "A woman, with a bird upon her wrist, stands amidst a great abundance of grapevines in the garden of a manorial house. It is a wide domain, suggesting plenty in all things. Possibly it is her own possession and testifies to material well-being."
    },
    {
        name: "Ten of Pentacles",
        meaning_up: "Gain, riches; family matters, archives, extraction, the abode of a family.",
        desc: "A man and woman beneath an archway which gives entrance to a house and domain. They are accompanied by a child, who looks curiously at two dogs accosting an ancient personage seated in the foreground. The child's hand is on one of them."
    },
    {
        name: "Page of Pentacles",
        meaning_up: "Application, study, scholarship, reflection another reading says news, messages and the bringer thereof; also rule, management.",
        desc: "A youthful figure, looking intently at the pentacle which hovers over his raised hands. He moves slowly, insensible of that which is about him."
    },
    {
        name: "Knight of Pentacles",
        meaning_up: "Utility, serviceableness, interest, responsibility, rectitude-all on the normal and external plane.",
        desc: "He rides a slow, enduring, heavy horse, to which his own aspect corresponds. He exhibits his symbol, but does not look therein."
    },
    {
        name: "Queen of Pentacles",
        meaning_up: "Opulence, generosity, magnificence, security, liberty.",
        desc: "The face suggests that of a dark woman, whose qualities might be summed up in the idea of greatness of soul; she has also the serious cast of intelligence; she contemplates her symbol and may see worlds therein."
    },
    {
        name: "King of Pentacles",
        meaning_up: "Valour, realizing intelligence, business and normal intellectual aptitude, sometimes mathematical gifts and attainments of this kind; success in these paths.",
        desc: "The figure calls for no special description the face is rather dark, suggesting also courage, but somewhat lethargic in tendency. The bull's head should be noted as a recurrent symbol on the throne. The sign of this suit is represented throughout as engraved or blazoned with the pentagram, typifying the correspondence of the four elements in human nature and that by which they may be governed."
    }
];
