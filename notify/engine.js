/* ===== Libraries: exercises, foods, meals ===== */
// Exercise: id, name, pattern, equipment, muscles, stress tags (limitations it loads),
// start ratio (working load / bodyweight for an intermediate lifter; per hand for DB),
// increment kg, technique cues, alternatives, compound?
const EX_RAW = [
  // Squat pattern
  ['bb-squat','Barbell Back Squat','squat','barbell','Quads, Glutes, Adductors','knee back',0.7,2.5,['Brace before you descend; ribs down','Knees track over toes','Sit down between the hips to at least parallel if pain-free','Drive the floor away; chest and hips rise together'],['goblet-squat','leg-press','hack-squat'],1],
  ['front-squat','Front Squat','squat','barbell','Quads, Glutes, Upper back','knee wrist',0.55,2.5,['Elbows high, bar on the shoulders','Stay upright; knees forward','Control the bottom, drive up through mid-foot'],['goblet-squat','bb-squat','hack-squat'],1],
  ['goblet-squat','Goblet Squat','squat','dumbbell','Quads, Glutes, Core','knee',0.25,2,['Hold the bell at the chest, elbows inside knees','Sit straight down, heels planted','Pause briefly at the bottom'],['bb-squat','leg-press','bw-squat'],1],
  ['leg-press','Leg Press','squat','machine','Quads, Glutes','knee',1.2,5,['Feet shoulder width, mid-platform','Lower until hips start to tuck, no further','Do not lock knees hard at the top'],['hack-squat','goblet-squat','bb-squat'],1],
  ['hack-squat','Hack Squat','squat','machine','Quads, Glutes','knee',0.8,5,['Back flat against the pad','Knees travel forward freely','Smooth turnaround at the bottom'],['leg-press','bb-squat','goblet-squat'],1],
  ['bw-squat','Bodyweight Squat (tempo)','squat','bodyweight','Quads, Glutes','knee',0,0,['3 seconds down, 1 second pause','Full range you own','Add a backpack for load when easy'],['goblet-squat','split-squat'],1],
  // Hinge
  ['rdl','Romanian Deadlift','hinge','barbell','Hamstrings, Glutes, Back','back',0.7,2.5,['Soft knees, push hips back','Bar slides down the thighs','Stop when hamstrings are stretched and back is still flat','Squeeze glutes to stand'],['db-rdl','hip-thrust','back-ext'],1],
  ['deadlift','Conventional Deadlift','hinge','barbell','Posterior chain, Back, Grip','back',1.0,2.5,['Bar over mid-foot, shins touch','Pull slack out of the bar before lifting','Push the floor, keep the bar close','Lock out with glutes, not by leaning back'],['trap-deadlift','rdl','db-rdl'],1],
  ['trap-deadlift','Trap Bar Deadlift','hinge','barbell','Quads, Glutes, Back','back',1.05,2.5,['Stand centred in the handle','Hips a little lower than a conventional pull','Drive up evenly'],['deadlift','rdl'],1],
  ['db-rdl','Dumbbell Romanian Deadlift','hinge','dumbbell','Hamstrings, Glutes','back',0.25,2,['Dumbbells close to the legs','Hinge until hamstrings stretch','Neutral neck'],['rdl','kb-swing','hip-thrust'],1],
  ['hip-thrust','Hip Thrust','hinge','barbell','Glutes, Hamstrings','',0.8,2.5,['Upper back on the bench edge','Chin tucked, ribs down','Full hip extension, pause 1 second'],['glute-bridge','db-rdl'],1],
  ['glute-bridge','Glute Bridge','hinge','bodyweight','Glutes','',0,0,['Heels close to the hips','Drive through heels','Pause at the top'],['hip-thrust','db-rdl'],0],
  ['kb-swing','Kettlebell Swing','hinge','kettlebell','Glutes, Hamstrings, Conditioning','back',0.2,4,['Hike the bell back like a pass','Snap the hips; arms just guide','Plank at the top'],['db-rdl','hip-thrust'],1],
  ['back-ext','Back Extension','hinge','machine','Spinal erectors, Glutes','back',0,2.5,['Pad just below hip crease','Move from the hips','Stop at a straight line'],['rdl','glute-bridge'],0],
  // Lunge / single leg
  ['split-squat','Bulgarian Split Squat','lunge','dumbbell','Quads, Glutes','knee hip',0.15,2,['Rear foot on bench, front foot far enough forward','Drop straight down','Most of the weight on the front leg'],['walking-lunge','step-up','leg-press'],1],
  ['walking-lunge','Walking Lunge','lunge','dumbbell','Quads, Glutes','knee',0.15,2,['Long, controlled steps','Back knee just above the floor','Tall torso'],['split-squat','step-up'],1],
  ['step-up','Dumbbell Step-up','lunge','dumbbell','Quads, Glutes','knee',0.12,2,['Box at knee height or lower','Drive through the top foot only','Control the way down'],['split-squat','walking-lunge'],1],
  ['reverse-lunge','Reverse Lunge (bodyweight)','lunge','bodyweight','Quads, Glutes','knee',0,0,['Step back softly','Front shin roughly vertical','Push through the front heel'],['split-squat','step-up'],1],
  // Leg isolation
  ['leg-ext','Leg Extension','quad-iso','machine','Quads','knee',0.35,2.5,['Pad on the lower shin','Squeeze 1 second at the top','Lower slowly'],['split-squat','goblet-squat'],0],
  ['leg-curl','Seated Leg Curl','ham-iso','machine','Hamstrings','',0.35,2.5,['Lean slightly forward','Full squeeze, slow return'],['nordic','db-rdl','swiss-curl'],0],
  ['swiss-curl','Swiss Ball / Slider Leg Curl','ham-iso','bodyweight','Hamstrings','',0,0,['Hips up throughout','Pull heels in, extend slowly'],['leg-curl','glute-bridge'],0],
  ['nordic','Nordic Curl (assisted)','ham-iso','bodyweight','Hamstrings','knee',0,0,['Lower as slowly as possible','Push back up with hands as needed'],['leg-curl','swiss-curl'],0],
  ['calf-raise','Standing Calf Raise','calf','machine','Calves','',0.6,5,['Full stretch at the bottom, pause','Rise as high as possible'],['db-calf'],0],
  ['db-calf','Single-leg Calf Raise','calf','dumbbell','Calves','',0.1,2,['Hold a support with one hand','Slow 2 second lowering'],['calf-raise'],0],
  // Horizontal push
  ['bench','Barbell Bench Press','hpush','barbell','Chest, Triceps, Front delts','shoulder wrist',0.6,2.5,['Shoulder blades pinched and down','Feet planted, slight arch','Bar to lower chest, elbows ~45°','Press up and slightly back'],['db-bench','machine-press','pushup'],1],
  ['db-bench','Dumbbell Bench Press','hpush','dumbbell','Chest, Triceps, Front delts','shoulder',0.22,2,['Dumbbells over the shoulders','Lower to chest level with control','Press without clanking at the top'],['bench','machine-press','pushup'],1],
  ['incline-db','Incline Dumbbell Press','hpush2','dumbbell','Upper chest, Front delts, Triceps','shoulder',0.18,2,['Bench at 30°','Elbows slightly tucked','Full stretch, smooth press'],['incline-bench','machine-press','pushup'],1],
  ['incline-bench','Incline Barbell Press','hpush2','barbell','Upper chest, Front delts','shoulder wrist',0.5,2.5,['Bench at 30°','Bar to upper chest','Keep wrists stacked'],['incline-db','machine-press'],1],
  ['machine-press','Machine Chest Press','hpush','machine','Chest, Triceps','',0.5,2.5,['Handles at mid-chest height','Shoulders back against the pad','Controlled lowering'],['db-bench','pushup'],1],
  ['pushup','Push-up','hpush','bodyweight','Chest, Triceps, Core','wrist shoulder',0,0,['Body in one straight line','Hands just outside shoulders','Chest to a fist from the floor','Elevate hands to make it easier'],['db-bench','machine-press'],1],
  ['dips','Dips (assisted if needed)','hpush2','bodyweight','Chest, Triceps','shoulder',0,0,['Slight forward lean','Lower until shoulders are just below elbows if pain-free'],['incline-db','pushup'],1],
  ['cable-fly','Cable Fly','chest-iso','cable','Chest','shoulder',0.12,2.5,['Soft bend in elbows, fixed','Hug a wide tree','Stretch without pain'],['db-fly','pec-deck'],0],
  ['pec-deck','Pec Deck','chest-iso','machine','Chest','shoulder',0.3,2.5,['Seat so handles are at chest height','Squeeze 1 second'],['cable-fly','db-fly'],0],
  ['db-fly','Dumbbell Fly','chest-iso','dumbbell','Chest','shoulder',0.08,1,['Light weight, big stretch','Elbows soft and fixed'],['cable-fly','pec-deck'],0],
  // Vertical push
  ['ohp','Standing Overhead Press','vpush','barbell','Shoulders, Triceps, Core','shoulder back',0.4,2.5,['Squeeze glutes, ribs down','Bar path straight; move the head back then through','Lock out over mid-foot'],['db-ohp','machine-ohp','pike-pushup'],1],
  ['db-ohp','Seated Dumbbell Shoulder Press','vpush','dumbbell','Shoulders, Triceps','shoulder',0.15,2,['Back supported','Elbows slightly forward','Press to just short of touching'],['ohp','machine-ohp'],1],
  ['machine-ohp','Machine Shoulder Press','vpush','machine','Shoulders, Triceps','shoulder',0.35,2.5,['Handles at shoulder height','Smooth reps'],['db-ohp','ohp'],1],
  ['pike-pushup','Pike Push-up','vpush','bodyweight','Shoulders, Triceps','shoulder wrist',0,0,['Hips high, head moves forward of the hands','Elevate feet to progress'],['db-ohp'],1],
  ['lat-raise','Dumbbell Lateral Raise','delt-iso','dumbbell','Side delts','shoulder',0.07,1,['Lead with the elbows','Raise to shoulder height','No swinging'],['cable-lat','band-lat'],0],
  ['cable-lat','Cable Lateral Raise','delt-iso','cable','Side delts','shoulder',0.05,1.25,['Cable behind the body','Smooth arc to shoulder height'],['lat-raise'],0],
  ['band-lat','Band Lateral Raise','delt-iso','bodyweight','Side delts','',0,0,['Stand on the band','Slow and controlled'],['lat-raise'],0],
  // Vertical pull
  ['pullup','Pull-up / Chin-up','vpull','bodyweight','Lats, Biceps, Upper back','shoulder elbow',0,0,['Start from a dead hang, shoulders engaged','Pull elbows to ribs','Chin over bar, lower under control','Use a band or assisted machine if needed'],['lat-pulldown','band-pulldown'],1],
  ['lat-pulldown','Lat Pulldown','vpull','cable','Lats, Biceps','shoulder',0.55,2.5,['Thighs locked under the pad','Pull bar to upper chest','Slight lean back, no swinging'],['pullup','single-pulldown'],1],
  ['single-pulldown','Single-arm Cable Pulldown','vpull','cable','Lats','',0.2,1.25,['Pull the elbow toward the hip','Full stretch at the top'],['lat-pulldown','pullup'],0],
  ['band-pulldown','Band Pulldown','vpull','bodyweight','Lats','',0,0,['Anchor band high','Elbows to ribs'],['pullup'],0],
  // Horizontal pull
  ['bb-row','Barbell Row','hpull','barbell','Upper back, Lats, Biceps','back',0.55,2.5,['Hinge to about 45°','Pull to the lower ribs','Keep the torso still'],['cs-row','cable-row','db-row'],1],
  ['db-row','One-arm Dumbbell Row','hpull','dumbbell','Lats, Upper back, Biceps','',0.28,2,['Hand and knee on bench, flat back','Pull dumbbell to the hip','Stretch at the bottom'],['cable-row','cs-row','inv-row'],1],
  ['cable-row','Seated Cable Row','hpull2','cable','Mid back, Lats, Biceps','',0.55,2.5,['Chest tall','Pull handle to the navel','Let shoulder blades move forward at the stretch'],['db-row','cs-row'],1],
  ['cs-row','Chest-supported Row','hpull2','dumbbell','Upper back, Rear delts','',0.22,2,['Chest on an incline bench','Pull elbows back and wide'],['db-row','cable-row'],1],
  ['inv-row','Inverted Row','hpull','bodyweight','Upper back, Biceps','',0,0,['Body straight like a plank','Chest to the bar','Bend knees to make it easier'],['db-row'],1],
  ['face-pull','Face Pull','rear-iso','cable','Rear delts, Rotator cuff','',0.2,2.5,['Rope at eye level','Pull to the face, thumbs back','Pause and squeeze'],['rear-fly','band-pullapart'],0],
  ['rear-fly','Reverse Dumbbell Fly','rear-iso','dumbbell','Rear delts','',0.05,1,['Chest on incline bench','Arms wide, small bend in elbows'],['face-pull','band-pullapart'],0],
  ['band-pullapart','Band Pull-apart','rear-iso','bodyweight','Rear delts, Upper back','',0,0,['Arms straight','Pull band to the chest'],['face-pull'],0],
  // Arms
  ['db-curl','Dumbbell Curl','biceps','dumbbell','Biceps','elbow',0.1,1,['Elbows pinned at the sides','Turn the palm up as you lift','Lower in 2 seconds'],['cable-curl','hammer-curl','bb-curl'],0],
  ['bb-curl','EZ-bar Curl','biceps','barbell','Biceps','elbow wrist',0.25,2.5,['Stand tall','No hip swing'],['db-curl','cable-curl'],0],
  ['hammer-curl','Hammer Curl','biceps2','dumbbell','Biceps, Brachialis, Forearms','',0.12,1,['Neutral grip','Control the lowering'],['db-curl','cable-curl'],0],
  ['cable-curl','Cable Curl','biceps2','cable','Biceps','elbow',0.2,1.25,['Step back to keep tension at the bottom','Squeeze at the top'],['db-curl'],0],
  ['pushdown','Cable Triceps Pushdown','triceps','cable','Triceps','elbow',0.25,1.25,['Elbows at the sides','Fully straighten, pause'],['oh-ext','db-kickback','close-pushup'],0],
  ['oh-ext','Overhead Triceps Extension','triceps2','dumbbell','Triceps (long head)','elbow shoulder',0.12,1,['Elbows point forward, not out','Deep stretch behind the head'],['pushdown','skullcrusher'],0],
  ['skullcrusher','EZ-bar Skull Crusher','triceps2','barbell','Triceps','elbow',0.2,2.5,['Lower to the forehead or just behind','Upper arms still'],['oh-ext','pushdown'],0],
  ['db-kickback','Dumbbell Kickback','triceps','dumbbell','Triceps','',0.05,1,['Upper arm parallel to the floor','Squeeze at lockout'],['pushdown'],0],
  ['close-pushup','Close-grip Push-up','triceps','bodyweight','Triceps, Chest','wrist',0,0,['Hands under the shoulders','Elbows close to the body'],['pushdown'],0],
  // Core
  ['plank','Plank','core','bodyweight','Core','',0,0,['Squeeze glutes and quads','Ribs pulled down','Hold for time (reps = seconds)'],['dead-bug','pallof'],0],
  ['dead-bug','Dead Bug','core','bodyweight','Core','',0,0,['Low back pressed to the floor','Move opposite arm and leg slowly','Exhale fully on each rep'],['plank','pallof'],0],
  ['pallof','Pallof Press','core','cable','Core (anti-rotation)','',0.08,1.25,['Stand side-on to the cable','Press out and hold 2 seconds','Do not let the hips twist'],['dead-bug','plank'],0],
  ['hanging-raise','Hanging Knee Raise','core','bodyweight','Abs, Hip flexors','shoulder',0,0,['No swinging','Curl the pelvis up at the top'],['dead-bug','cable-crunch'],0],
  ['cable-crunch','Cable Crunch','core','cable','Abs','back',0.3,2.5,['Hips stay still','Curl the ribs toward the pelvis'],['dead-bug','hanging-raise'],0],
  // Conditioning
  ['bike','Bike Intervals','cardio','machine','Conditioning','',0,0,['5 min easy warm-up','Then 30 s hard / 90 s easy','Cool down 3 min'],['row-erg','incline-walk'],0],
  ['row-erg','Rowing Machine','cardio','machine','Conditioning, Back','back',0,0,['Legs, then body, then arms','Reverse on the way back'],['bike','incline-walk'],0],
  ['incline-walk','Incline Treadmill Walk','cardio','machine','Conditioning','',0,0,['Brisk pace you can talk at','Do not hold the rails'],['bike','brisk-walk'],0],
  ['brisk-walk','Brisk Walk / Jog','cardio','bodyweight','Conditioning','',0,0,['Conversational pace','Build duration before speed'],['bike'],0],
  // 5-Day Split extras
  ['preacher-curl','Preacher Curl','biceps','barbell','Biceps','elbow',0.22,2.5,['Armpits snug on the top of the pad','Lower until the elbows are almost straight, under control','No bouncing at the bottom'],['bb-curl','db-curl','cable-curl'],0],
  ['bb-curl-straight','Barbell Curl','biceps','barbell','Biceps, Forearms','elbow wrist',0.3,2.5,['Grip just outside the hips, elbows at your sides','Curl without leaning back','Lower slowly over 2 seconds'],['bb-curl','db-curl','cable-curl'],0],
  ['adductor','Adductor Machine','adductor','machine','Inner thighs (adductors)','hip',0.6,5,['Sit tall against the back pad','Squeeze the pads together and pause','Open slowly; only as wide as is comfortable'],['split-squat','goblet-squat'],0],
  ['lying-leg-curl','Lying Leg Curl','ham-iso','machine','Hamstrings','',0.3,2.5,['Pad just above the heels, knees just off the bench','Keep hips pressed into the bench','Curl up, pause, lower slowly'],['leg-curl','swiss-curl','nordic'],0],
  ['rev-pec-deck','Reverse Pec Fly (machine)','rear-iso','machine','Rear delts, Upper back','',0.3,2.5,['Chest against the pad, handles at shoulder height','Sweep the arms back with soft elbows','Squeeze the shoulder blades, then return slowly'],['rear-fly','face-pull','band-pullapart'],0],
  ['front-raise','Dumbbell Front Raise','delt-iso','dumbbell','Front delts','shoulder',0.07,1,['Thumbs up or palms down, slight bend in the elbows','Raise to shoulder height, no higher','No swinging: control the way down'],['lat-raise','db-ohp'],0],
  // Archery support (shoulder health, upper back, both-sides balance)
  ['band-er','Band External Rotation','prehab','bodyweight','Rotator cuff','',0,0,['Elbow tucked to your side, towel under the arm','Rotate out slowly, keep the elbow still','Equal reps on both arms'],['face-pull','band-pullapart'],0],
  ['ytw','Prone Y-T-W Raise','prehab','bodyweight','Lower traps, Rear delts','',0,0,['Lie face down on an incline bench or the floor','Thumbs up, lift into a Y, then T, then W','Small, slow and pain-free; no weight needed at first'],['band-pullapart','face-pull'],0],
  ['band-draw','Band Bow Draw (both sides)','prehab','bodyweight','Rhomboids, Rear delts, Rotator cuff','',0,0,['Hold the band like your bow and draw to your anchor point','Keep the bow shoulder low and the draw elbow in line','Do the same reps on your non-shooting side too'],['band-pullapart','db-row'],0],
  ['open-book','Open-book Thoracic Rotation','prehab','bodyweight','Thoracic spine, Chest','',0,0,['Lie on your side, knees bent, arms together','Open the top arm across, following it with your eyes','Go only as far as feels comfortable; same reps each side'],['mobility'],0],
  ['farmer-carry','Farmer Carry','carry','dumbbell','Grip, Upper back, Core','',0.35,2,['Stand tall, shoulders down and back','Short, steady steps','Carry for 30-40 m, then rest','Log the distance in metres as reps'],['db-row'],0],
  ['mobility','Mobility Flow','mobility','bodyweight','Hips, Thoracic spine, Shoulders','',0,0,['World\'s greatest stretch x5 per side','Cat-cow x10','90/90 hip switches x10','Thread the needle x6 per side','Deep squat hold 60 s'],['brisk-walk'],0],
];
const EXERCISES = {};
EX_RAW.forEach(r => {
  EXERCISES[r[0]] = { id:r[0], name:r[1], pattern:r[2], equip:r[3], muscles:r[4], stress:r[5] ? r[5].split(' ') : [], ratio:r[6], inc:r[7], cues:r[8], alt:r[9], compound:!!r[10] };
});

// Patterns and the equipment sets
const EQUIP_SETS = {
  full: ['barbell','dumbbell','machine','cable','bodyweight','kettlebell'],
  dumbbell: ['dumbbell','bodyweight','kettlebell'],
  bodyweight: ['bodyweight'],
};

// Foods per 100 g (or 100 ml): kcal, protein, carbs, fat, fibre; tags; category; approx AUD per 100g
// Values are typical averages from general food composition tables - estimates only.
const FOOD_RAW = [
  ['oats','Rolled oats',379,13.2,60,6.5,10,'gluten?','carb',0.5],
  ['weetbix','Wheat biscuits (Weet-Bix)',360,12,62,1.4,11,'gluten','carb',0.9],
  ['wholegrain-bread','Wholegrain bread',247,10,41,3.4,7,'gluten','carb',0.9],
  ['wrap','Wholemeal wrap',300,9,48,7,5,'gluten','carb',1.4],
  ['rice-cooked','White rice, cooked',130,2.7,28,0.3,0.4,'','carb',0.3],
  ['brown-rice-cooked','Brown rice, cooked',123,2.7,25.6,1,1.6,'','carb',0.4],
  ['pasta-cooked','Pasta, cooked',158,5.8,31,0.9,1.8,'gluten','carb',0.3],
  ['potato','Potato, boiled',87,1.9,20,0.1,1.8,'','carb',0.4],
  ['sweet-potato','Sweet potato, baked',90,2,20.7,0.2,3.3,'','carb',0.6],
  ['quinoa-cooked','Quinoa, cooked',120,4.4,21.3,1.9,2.8,'','carb',1.0],
  ['banana','Banana',89,1.1,22.8,0.3,2.6,'','fruit',0.5],
  ['berries','Mixed berries (frozen)',50,0.8,11,0.3,3.5,'','fruit',1.2],
  ['apple','Apple',52,0.3,13.8,0.2,2.4,'','fruit',0.5],
  ['orange','Orange',47,0.9,11.8,0.1,2.4,'','fruit',0.5],
  ['chicken-breast','Chicken breast, cooked',165,31,0,3.6,0,'meat','protein',1.6],
  ['chicken-thigh','Chicken thigh, cooked (skinless)',209,26,0,10.9,0,'meat','protein',1.3],
  ['beef-mince','Lean beef mince 5% fat, cooked',175,26,0,7.5,0,'meat','protein',1.6],
  ['steak','Beef rump steak, cooked',190,30,0,7.5,0,'meat','protein',2.6],
  ['turkey-mince','Turkey mince, cooked',170,27,0,7,0,'meat','protein',1.8],
  ['salmon','Salmon, cooked',206,22,0,12.4,0,'fish','protein',3.5],
  ['tuna','Tuna in springwater, drained',116,26,0,1,0,'fish','protein',1.8],
  ['white-fish','White fish (basa/barramundi), cooked',115,23,0,2.2,0,'fish','protein',2.0],
  ['prawns','Prawns, cooked',99,24,0.2,0.3,0,'shellfish','protein',3.5],
  ['egg','Egg (approx 50 g each)',143,12.6,0.7,9.5,0,'egg','protein',0.8],
  ['egg-white','Egg whites (liquid)',52,11,0.7,0.2,0,'egg','protein',0.9],
  ['greek-yoghurt','Greek yoghurt, low fat',73,10,4,1.7,0,'dairy','dairy',0.8],
  ['cottage-cheese','Cottage cheese, reduced fat',81,11,3.4,2.3,0,'dairy','dairy',1.0],
  ['milk','Milk, skim',35,3.5,5,0.1,0,'dairy','dairy',0.15],
  ['soy-milk','Soy milk, unsweetened',33,3.3,0.6,1.8,0.5,'soy vegan','dairy',0.25],
  ['cheese','Cheddar, reduced fat',314,30,0.5,21,0,'dairy','fat',1.6],
  ['feta','Feta, reduced fat',200,19,1,13,0,'dairy','fat',2.0],
  ['whey','Whey protein powder',390,78,7,6,0,'dairy','protein',4.0],
  ['pea-protein','Pea / plant protein powder',380,75,8,6,3,'vegan','protein',4.5],
  ['tofu','Firm tofu',144,15.8,2.8,8.7,2.3,'soy vegan','protein',0.9],
  ['tempeh','Tempeh',192,20,7.6,10.8,5,'soy vegan','protein',1.6],
  ['lentils','Lentils, cooked/canned drained',116,9,20,0.4,7.9,'vegan','protein',0.4],
  ['chickpeas','Chickpeas, canned drained',139,7,20,2.6,6,'vegan','protein',0.4],
  ['black-beans','Black beans, canned drained',132,8.9,23.7,0.5,8.7,'vegan','protein',0.5],
  ['edamame','Edamame, shelled',121,11.9,8.9,5.2,5.2,'soy vegan','protein',1.2],
  ['peanut-butter','Peanut butter',588,25,20,50,6,'nuts vegan','fat',1.0],
  ['almonds','Almonds',579,21,22,50,12.5,'nuts vegan','fat',2.2],
  ['olive-oil','Olive oil',884,0,0,100,0,'vegan','fat',1.2],
  ['avocado','Avocado',160,2,8.5,14.7,6.7,'vegan','fat',1.5],
  ['broccoli','Broccoli',34,2.8,6.6,0.4,2.6,'vegan','veg',0.6],
  ['spinach','Baby spinach',23,2.9,3.6,0.4,2.2,'vegan','veg',1.5],
  ['mixed-veg','Frozen mixed vegetables',65,3,12,0.5,4,'vegan','veg',0.4],
  ['salad-mix','Salad mix (lettuce, tomato, cucumber)',18,1,3.2,0.2,1.3,'vegan','veg',0.8],
  ['capsicum','Capsicum',31,1,6,0.3,2.1,'vegan','veg',0.8],
  ['tomato-passata','Tomato passata',30,1.5,5.5,0.2,1.5,'vegan','veg',0.4],
  ['stir-fry-veg','Stir-fry vegetables',35,2,6,0.3,2.5,'vegan','veg',0.6],
  ['honey','Honey',304,0.3,82,0,0.2,'','carb',1.0],
  ['dark-choc','Dark chocolate 70%',598,7.8,46,43,11,'vegan?','fat',3.0],
  ['rice-cakes','Rice cakes',387,8,81,2.8,4,'','carb',1.2],
  ['hummus','Hummus',166,7.9,14.3,9.6,6,'vegan','fat',1.2],
  ['soy-sauce','Soy sauce (reduced salt)',60,8,6,0,0,'soy gluten vegan','veg',0.5],
  ['protein-bar','Protein bar',360,30,35,11,8,'dairy','protein',5.0],
];
const FOODS = {};
FOOD_RAW.forEach(r => {
  FOODS[r[0]] = { id:r[0], name:r[1], kcal:r[2], p:r[3], c:r[4], f:r[5], fib:r[6], tags:r[7] ? r[7].replace(/\?/g,'').split(' ').filter(Boolean) : [], cat:r[8], price:r[9] };
});
// Substitute groups for ingredient swaps
const SUBS = {
  protein: ['chicken-breast','chicken-thigh','turkey-mince','beef-mince','steak','salmon','tuna','white-fish','prawns','tofu','tempeh','lentils','chickpeas','egg'],
  carb: ['rice-cooked','brown-rice-cooked','pasta-cooked','potato','sweet-potato','quinoa-cooked','wholegrain-bread','wrap','oats'],
  dairy: ['greek-yoghurt','cottage-cheese','milk','soy-milk'],
  fat: ['olive-oil','avocado','peanut-butter','almonds','cheese','feta','hummus'],
  veg: ['broccoli','spinach','mixed-veg','salad-mix','capsicum','stir-fry-veg'],
  fruit: ['banana','berries','apple','orange'],
};

// Meal templates. items: [foodId, grams]. budget 1 (cheap) - 3. prep: quick | batch
const MEALS = [
  // Breakfast
  {id:'b-oats',slot:'breakfast',name:'Protein oats with berries',items:[['oats',60],['milk',250],['whey',25],['berries',100]],budget:1,prep:'quick',steps:['Microwave oats and milk 2 minutes, stirring halfway.','Stir in protein powder with a splash of milk.','Top with berries.']},
  {id:'b-vegan-oats',slot:'breakfast',name:'Plant protein oats',items:[['oats',60],['soy-milk',250],['pea-protein',25],['banana',100],['peanut-butter',10]],budget:1,prep:'quick',steps:['Cook oats in soy milk.','Stir through protein powder.','Top with sliced banana and peanut butter.']},
  {id:'b-eggs-toast',slot:'breakfast',name:'Scrambled eggs on toast',items:[['egg',150],['wholegrain-bread',80],['spinach',40],['olive-oil',5]],budget:1,prep:'quick',steps:['Whisk eggs with a pinch of salt.','Wilt spinach in the oiled pan, add eggs and stir gently on low heat.','Serve on toast.']},
  {id:'b-yoghurt-bowl',slot:'breakfast',name:'Greek yoghurt bowl',items:[['greek-yoghurt',250],['oats',40],['berries',100],['honey',10]],budget:1,prep:'quick',steps:['Layer yoghurt, oats and berries.','Drizzle with honey.']},
  {id:'b-weetbix',slot:'breakfast',name:'Weet-Bix, milk and banana',items:[['weetbix',45],['milk',250],['banana',100],['greek-yoghurt',100]],budget:1,prep:'quick',steps:['Three biscuits with milk.','Slice banana on top, yoghurt on the side.']},
  {id:'b-tofu-scramble',slot:'breakfast',name:'Tofu scramble wrap',items:[['tofu',150],['wrap',60],['spinach',40],['capsicum',50],['olive-oil',5]],budget:2,prep:'quick',steps:['Crumble tofu into an oiled pan with capsicum.','Season with turmeric, salt and pepper; add spinach.','Roll into the warmed wrap.']},
  // Lunch
  {id:'l-chicken-rice',slot:'lunch',name:'Chicken, rice and greens',items:[['chicken-breast',150],['rice-cooked',200],['broccoli',120],['olive-oil',5]],budget:1,prep:'batch',steps:['Batch-cook: bake chicken 20 min at 200°C with oil and seasoning.','Cook rice; steam broccoli.','Portion into containers (keeps 3-4 days chilled).']},
  {id:'l-tuna-wrap',slot:'lunch',name:'Tuna salad wrap',items:[['tuna',95],['wrap',60],['salad-mix',80],['avocado',40]],budget:1,prep:'quick',steps:['Drain tuna, mash with avocado, salt and lemon.','Fill the wrap with salad and tuna mix.']},
  {id:'l-lentil-bowl',slot:'lunch',name:'Lentil and quinoa bowl',items:[['lentils',200],['quinoa-cooked',150],['spinach',50],['feta',30],['olive-oil',7]],budget:1,prep:'batch',steps:['Combine warm quinoa and drained lentils.','Toss with spinach, oil and lemon.','Crumble feta on top.']},
  {id:'l-vegan-bowl',slot:'lunch',name:'Chickpea and hummus bowl',items:[['chickpeas',200],['brown-rice-cooked',150],['salad-mix',100],['hummus',40]],budget:1,prep:'batch',steps:['Roast chickpeas 20 min at 200°C with paprika.','Serve over rice with salad and hummus.']},
  {id:'l-beef-burrito',slot:'lunch',name:'Beef and bean burrito bowl',items:[['beef-mince',130],['black-beans',100],['rice-cooked',150],['capsicum',60],['cheese',15]],budget:2,prep:'batch',steps:['Brown mince with taco spices, add beans.','Serve over rice with capsicum and cheese.']},
  {id:'l-chicken-sandwich',slot:'lunch',name:'Chicken salad sandwich',items:[['chicken-breast',120],['wholegrain-bread',90],['salad-mix',60],['avocado',30]],budget:1,prep:'quick',steps:['Use leftover or pre-cooked chicken.','Layer on bread with salad and avocado.']},
  // Dinner
  {id:'d-salmon-potato',slot:'dinner',name:'Salmon, potatoes and greens',items:[['salmon',150],['potato',250],['broccoli',120],['olive-oil',5]],budget:3,prep:'quick',steps:['Boil potatoes 15 minutes.','Pan-fry salmon skin-side down 4 min, flip for 2-3 min.','Steam broccoli; season with lemon.']},
  {id:'d-stirfry',slot:'dinner',name:'Chicken stir-fry with rice',items:[['chicken-thigh',150],['stir-fry-veg',200],['rice-cooked',200],['soy-sauce',15],['olive-oil',7]],budget:1,prep:'quick',steps:['Slice chicken, stir-fry in hot oil 5-6 minutes.','Add vegetables 3 minutes, then soy sauce, garlic and ginger.','Serve over rice.']},
  {id:'d-bolognese',slot:'dinner',name:'Lean beef bolognese',items:[['beef-mince',150],['tomato-passata',150],['pasta-cooked',220],['mixed-veg',100]],budget:1,prep:'batch',steps:['Brown mince, add onion, garlic and grated veg.','Add passata and simmer 15 minutes.','Serve with pasta. Freezes well.']},
  {id:'d-tofu-stirfry',slot:'dinner',name:'Crispy tofu stir-fry',items:[['tofu',200],['stir-fry-veg',200],['brown-rice-cooked',180],['soy-sauce',15],['olive-oil',10]],budget:1,prep:'quick',steps:['Press and cube tofu; fry in oil until golden.','Add vegetables and sauce.','Serve with rice.']},
  {id:'d-fish-tacos',slot:'dinner',name:'Fish tacos',items:[['white-fish',170],['wrap',80],['salad-mix',80],['avocado',40],['greek-yoghurt',40]],budget:2,prep:'quick',steps:['Season fish with paprika and cumin; pan-fry 3 min per side.','Fill wraps with fish, salad, avocado and yoghurt-lime sauce.']},
  {id:'d-steak-sweetpotato',slot:'dinner',name:'Steak with sweet potato',items:[['steak',160],['sweet-potato',220],['salad-mix',100],['olive-oil',5]],budget:3,prep:'quick',steps:['Bake sweet potato wedges 30 min at 200°C.','Sear steak 3-4 min per side; rest 5 minutes.','Serve with salad.']},
  {id:'d-lentil-curry',slot:'dinner',name:'Lentil and spinach curry',items:[['lentils',250],['tomato-passata',100],['spinach',60],['rice-cooked',180],['olive-oil',7]],budget:1,prep:'batch',steps:['Fry onion, garlic and curry spices in oil.','Add lentils and passata, simmer 10 minutes.','Stir in spinach; serve with rice.']},
  {id:'d-prawn-pasta',slot:'dinner',name:'Garlic prawn pasta',items:[['prawns',150],['pasta-cooked',220],['spinach',50],['olive-oil',10]],budget:3,prep:'quick',steps:['Cook pasta.','Fry garlic and chilli in oil, add prawns 3 minutes.','Toss with pasta and spinach.']},
  // Snacks
  {id:'s-shake',slot:'snack',name:'Protein shake and banana',items:[['whey',30],['milk',300],['banana',100]],budget:1,prep:'quick',steps:['Shake or blend.']},
  {id:'s-plant-shake',slot:'snack',name:'Plant protein shake',items:[['pea-protein',30],['soy-milk',300],['berries',80]],budget:1,prep:'quick',steps:['Blend until smooth.']},
  {id:'s-cottage',slot:'snack',name:'Cottage cheese and fruit',items:[['cottage-cheese',150],['berries',80]],budget:1,prep:'quick',steps:['Top cottage cheese with fruit.']},
  {id:'s-ricecakes',slot:'snack',name:'Rice cakes with peanut butter',items:[['rice-cakes',25],['peanut-butter',20],['banana',60]],budget:1,prep:'quick',steps:['Spread peanut butter, top with banana slices.']},
  {id:'s-yoghurt',slot:'snack',name:'Greek yoghurt and almonds',items:[['greek-yoghurt',200],['almonds',15]],budget:1,prep:'quick',steps:['Mix and eat.']},
  {id:'s-edamame',slot:'snack',name:'Edamame and apple',items:[['edamame',120],['apple',150]],budget:2,prep:'quick',steps:['Microwave edamame 2 minutes, salt lightly.']},
  {id:'s-hummus',slot:'snack',name:'Hummus and veggie sticks',items:[['hummus',60],['capsicum',100],['rice-cakes',15]],budget:1,prep:'quick',steps:['Slice capsicum, dip.']},
  {id:'s-eggs',slot:'snack',name:'Boiled eggs and fruit',items:[['egg',100],['orange',150]],budget:1,prep:'batch',steps:['Boil a batch of eggs 9 minutes; keep chilled up to 5 days.']},
];
const MEAL_BY_ID = Object.fromEntries(MEALS.map(m => [m.id, m]));
/* ===== Engines (no DOM) ===== */
const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const pad2 = n => String(n).padStart(2,'0');
function isoDate(d){ d = d ? new Date(d) : new Date(); return d.getFullYear()+'-'+pad2(d.getMonth()+1)+'-'+pad2(d.getDate()); }
function parseISO(s){ const [y,m,d] = s.split('-').map(Number); return new Date(y, m-1, d); }
function addDays(s, n){ const d = parseISO(s); d.setDate(d.getDate()+n); return isoDate(d); }
function dowOf(s){ return parseISO(s).getDay(); }
function weekStart(s){ const d = dowOf(s); return addDays(s, d === 0 ? -6 : 1 - d); } // Monday
function daysBetween(a, b){ return Math.round((parseISO(b) - parseISO(a)) / 86400000); }
function uid(){ return Date.now().toString(36) + Math.random().toString(36).slice(2,8); }
function roundTo(x, step){ if (!step) return Math.round(x); return Math.round(x / step) * step; }
function r1(x){ return Math.round(x * 10) / 10; }
function e1rm(w, r){ if (!w || !r) return 0; return w * (1 + Math.min(r, 12) / 30); }
function avg(a){ const v = a.filter(x => x != null && !isNaN(x)); return v.length ? v.reduce((s,x)=>s+x,0)/v.length : null; }
function sum(a){ return a.reduce((s,x)=>s+(x||0),0); }

/* ---------- Workout plan generation ---------- */
const SLOT_TEMPLATES = {
  push:   { name:'Push', focus:'Chest, shoulders, triceps', slots:['hpush','vpush','hpush2','delt-iso','triceps','chest-iso','triceps2','core'] },
  pull:   { name:'Pull', focus:'Back, rear delts, biceps', slots:['vpull','hpull','hpull2','rear-iso','biceps','biceps2','core'] },
  legs:   { name:'Legs', focus:'Quads, hamstrings, glutes, calves', slots:['squat','hinge','lunge','quad-iso','ham-iso','calf','core'] },
  upperA: { name:'Upper A', focus:'Horizontal push and pull', slots:['hpush','hpull','vpush','vpull','delt-iso','biceps','triceps','chest-iso'] },
  upperB: { name:'Upper B', focus:'Vertical push and pull', slots:['vpush','vpull','hpush2','hpull2','delt-iso','triceps2','biceps2','rear-iso'], variant:1 },
  lowerA: { name:'Lower A', focus:'Squat focus', slots:['squat','hinge','lunge','ham-iso','quad-iso','calf','core'] },
  lowerB: { name:'Lower B', focus:'Hinge focus', slots:['hinge','squat','lunge','quad-iso','ham-iso','calf','core'], variant:1 },
  fullA:  { name:'Full Body A', focus:'Squat, press, row', slots:['squat','hpush','hpull','hinge','delt-iso','core','biceps','triceps'] },
  fullB:  { name:'Full Body B', focus:'Hinge, overhead, pull-down', slots:['hinge','vpush','vpull','lunge','triceps','core','rear-iso','calf'], variant:1 },
  fullC:  { name:'Full Body C', focus:'Single leg, incline, cable row', slots:['lunge','hpush2','hpull2','squat','biceps','calf','core','delt-iso'], variant:1 },
};
const SPLITS = {
  full: { label:'Full body', byDays:{1:['fullA'],2:['fullA','fullB'],3:['fullA','fullB','fullC'],4:['fullA','fullB','fullC','fullA'],5:['fullA','fullB','fullC','fullA','fullB'],6:['fullA','fullB','fullC','fullA','fullB','fullC']} },
  ul:   { label:'Upper / lower', byDays:{1:['fullA'],2:['upperA','lowerA'],3:['upperA','lowerA','upperB'],4:['upperA','lowerA','upperB','lowerB'],5:['upperA','lowerA','upperB','lowerB','upperA'],6:['upperA','lowerA','upperB','lowerB','upperA','lowerA']} },
  ppl:  { label:'Push / pull / legs', byDays:{1:['fullA'],2:['fullA','fullB'],3:['push','pull','legs'],4:['push','pull','legs','upperA'],5:['push','pull','legs','upperA','lowerA'],6:['push','pull','legs','push','pull','legs']} },
};
const PATTERN_FALLBACK = { hpush2:'hpush', hpull2:'hpull', biceps2:'biceps', triceps2:'triceps', 'chest-iso':null, 'rear-iso':null, 'quad-iso':null, 'ham-iso':null, calf:null, 'delt-iso':null };
const BEGINNER_DEPRIORITISE = ['deadlift','front-squat','bb-row','skullcrusher','nordic','dips','hanging-raise'];
const DEFAULT_TRAIN_DAYS = {1:[3],2:[1,4],3:[1,3,5],4:[1,2,4,5],5:[1,2,3,5,6],6:[1,2,3,4,5,6],7:[0,1,2,3,4,5,6]};

function autoSplit(days){ return days <= 3 ? 'full' : days === 4 ? 'ul' : days === 5 ? 'ul' : 'ppl'; }
function splitWorkouts(splitKey, days){
  if (splitKey === 'ul' && days === 5) return ['upperA','lowerA','push','pull','legs'];
  const s = SPLITS[splitKey] || SPLITS.full; return s.byDays[Math.max(1, Math.min(6, days))];
}
function limitationTags(profile){
  const t = new Set(profile.limitations || []);
  return t;
}
function avoidedNames(profile){
  return (profile.avoid || '').toLowerCase().split(/[,;\n]/).map(s=>s.trim()).filter(s => s.length > 2);
}
function exerciseAllowed(ex, profile, equipList){
  if (!equipList.includes(ex.equip)) return false;
  const lim = limitationTags(profile);
  if (ex.stress.some(s => lim.has(s))) return false;
  const av = avoidedNames(profile);
  if (av.some(a => ex.name.toLowerCase().includes(a))) return false;
  return true;
}
function candidatesFor(pattern, profile, equipList, used){
  let list = Object.values(EXERCISES).filter(e => e.pattern === pattern && !used.has(e.id) && exerciseAllowed(e, profile, equipList));
  if (profile.experience === 'beginner') list.sort((a,b) => (BEGINNER_DEPRIORITISE.includes(a.id)?1:0) - (BEGINNER_DEPRIORITISE.includes(b.id)?1:0));
  return list;
}
function pickExercise(pattern, profile, equipList, used, variant){
  let list = candidatesFor(pattern, profile, equipList, used);
  if (!list.length && PATTERN_FALLBACK[pattern]) list = candidatesFor(PATTERN_FALLBACK[pattern], profile, equipList, used);
  if (!list.length) return null;
  return list[Math.min(variant || 0, list.length - 1)];
}
function repScheme(goal, ex, index, experience){
  const iso = !ex.compound;
  let s;
  if (ex.pattern === 'core') s = ex.id === 'plank' ? {sets:3, repMin:30, repMax:45, rest:60} : {sets:3, repMin:8, repMax:12, rest:60};
  else if (goal === 'strength') s = !iso && index < 2 ? {sets:4, repMin:4, repMax:6, rest:180} : !iso ? {sets:3, repMin:6, repMax:10, rest:120} : {sets:3, repMin:10, repMax:12, rest:75};
  else if (goal === 'fat_loss') s = !iso ? {sets:3, repMin:8, repMax:12, rest:90} : {sets:3, repMin:12, repMax:15, rest:60};
  else if (goal === 'endurance') s = !iso ? {sets:3, repMin:12, repMax:15, rest:60} : {sets:2, repMin:15, repMax:20, rest:45};
  else if (goal === 'muscle_gain' || goal === 'recomp') s = !iso && index === 0 ? {sets:3, repMin:6, repMax:10, rest:150} : !iso ? {sets:3, repMin:8, repMax:12, rest:90} : {sets:3, repMin:10, repMax:15, rest:60};
  else s = !iso ? {sets:3, repMin:8, repMax:12, rest:90} : {sets:2, repMin:10, repMax:15, rest:60};
  if (experience === 'beginner') s.sets = Math.min(s.sets, 3);
  if (experience === 'advanced' && !iso && goal !== 'endurance') s.sets = Math.min(s.sets + 1, 5);
  return s;
}
function startingWeight(ex, profile, repMax){
  if (!ex.ratio || !profile.weightKg) return 0;
  const exp = {beginner:0.55, intermediate:0.8, advanced:1.0}[profile.experience] || 0.6;
  const lower = ['squat','hinge','lunge','quad-iso','ham-iso','calf'].includes(ex.pattern);
  const sex = profile.sex === 'female' ? (lower ? 0.75 : 0.6) : profile.sex === 'male' ? 1 : (lower ? 0.85 : 0.78);
  const repF = repMax <= 6 ? 1.1 : repMax >= 15 ? 0.8 : 1;
  const w = profile.weightKg * ex.ratio * exp * sex * repF;
  const inc = ex.inc || 2.5;
  return Math.max(ex.equip === 'barbell' ? 20 : inc, roundTo(w, inc));
}
const DURATION_EXERCISES = {30:4, 45:5, 60:6, 75:7, 90:8};
function buildWorkout(tplKey, profile, idx){
  const tpl = SLOT_TEMPLATES[tplKey];
  const equipList = EQUIP_SETS[profile.equipment || 'full'];
  const maxN = DURATION_EXERCISES[profile.duration || 60] || 6;
  const used = new Set(); const exercises = [];
  for (const slot of tpl.slots){
    if (exercises.length >= maxN) break;
    const ex = pickExercise(slot, profile, equipList, used, tpl.variant || 0);
    if (!ex) continue;
    used.add(ex.id);
    const sch = repScheme(profile.goal, ex, exercises.length, profile.experience);
    exercises.push({ exId: ex.id, ...sch, start: startingWeight(ex, profile, sch.repMax) });
  }
  let cardio = null;
  if (profile.goal === 'fat_loss' || profile.goal === 'endurance' || profile.goal === 'general') {
    const c = ['bike','row-erg','incline-walk','brisk-walk'].map(id => EXERCISES[id]).find(e => exerciseAllowed(e, profile, EQUIP_SETS[profile.equipment || 'full']));
    if (c) cardio = { exId: c.id, minutes: profile.goal === 'endurance' ? 20 : 10 };
  }
  return { id: tplKey + '-' + idx, tpl: tplKey, name: tpl.name, focus: tpl.focus, exercises, cardio };
}
function generatePlan(profile){
  const days = Math.max(1, Math.min(7, profile.daysPerWeek || 3));
  const splitKey = profile.split && profile.split !== 'auto' ? profile.split : autoSplit(Math.min(days, 6));
  const tpls = splitWorkouts(splitKey, Math.min(days, 6));
  const seen = {}; const workouts = []; const rotation = [];
  tpls.forEach((k, i) => {
    if (seen[k]) { rotation.push(seen[k]); return; }
    const w = buildWorkout(k, profile, i); seen[k] = w.id; workouts.push(w); rotation.push(w.id);
  });
  if (days === 7) { // 7th day is active recovery
    const m = { id:'mobility-7', tpl:'mobility', name:'Mobility & Recovery', focus:'Active recovery', exercises:[{exId:'mobility', sets:1, repMin:15, repMax:20, rest:0, start:0}], cardio:{exId:'brisk-walk', minutes:20} };
    workouts.push(m); rotation.push(m.id);
  }
  let trainDays = (profile.trainDays && profile.trainDays.length === days) ? profile.trainDays.slice().sort() : DEFAULT_TRAIN_DAYS[days];
  return { split: splitKey, splitLabel: (SPLITS[splitKey]||{}).label || 'Custom', workouts, rotation, trainDays, pointer: 0, generatedAt: Date.now(), version: 1 };
}
function warmupFor(workout){
  const first = workout.exercises[0] && EXERCISES[workout.exercises[0].exId];
  const lines = ['5 min easy bike, row or brisk walk', 'Dynamic mobility: leg swings, hip openers, arm circles (2 min)'];
  if (first && first.ratio) lines.push(`Ramp-up sets on ${first.name}: empty bar/light x10, ~50% x6, ~75% x3, then working sets`);
  return lines;
}
function estimateDuration(workout){
  let sec = 8 * 60; // warm-up
  for (const e of workout.exercises){ sec += e.sets * (45 + (e.rest || 60)); }
  if (workout.cardio) sec += workout.cardio.minutes * 60;
  return Math.round(sec / 60 / 5) * 5;
}

/* ---------- Schedule ---------- */
function isTrainingDay(S, date){
  const sc = S.sched || {}; const plan = S.plan; if (!plan) return false;
  if ((sc.extra || {})[date]) return true;
  if ((sc.rest || {})[date]) return false;
  return plan.trainDays.includes(dowOf(date));
}
function sessionsOn(S, date){ return S.sessions.filter(s => s.date === date && s.end); }
function workoutById(S, id){ return S.plan && S.plan.workouts.find(w => w.id === id); }
// Project the rotation onto upcoming dates. A missed day never doubles up: the next workout simply
// moves to the next training day.
function projectSchedule(S, fromDate, nDays){
  const out = []; const plan = S.plan; if (!plan) return out;
  let ptr = plan.pointer % plan.rotation.length;
  const today = isoDate();
  for (let i = 0; i < nDays; i++){
    const d = addDays(fromDate, i);
    const done = sessionsOn(S, d);
    if (d < today) { out.push({ date:d, past:true, done, training:isTrainingDay(S, d) }); continue; }
    if (d === today && done.length) { out.push({ date:d, done, training:true }); continue; }
    if (isTrainingDay(S, d)) { out.push({ date:d, training:true, workoutId: plan.rotation[ptr], done }); ptr = (ptr + 1) % plan.rotation.length; }
    else out.push({ date:d, training:false, done });
  }
  return out;
}
function todayPlan(S){
  const p = projectSchedule(S, isoDate(), 1)[0];
  return p;
}
function weekStats(S, refDate){
  const ws = weekStart(refDate || isoDate());
  const we = addDays(ws, 6);
  const sess = S.sessions.filter(s => s.end && s.date >= ws && s.date <= we);
  const target = S.plan ? S.plan.trainDays.length : (S.profile.daysPerWeek || 3);
  return { ws, we, done: sess.length, target, volume: sum(sess.map(s => s.volume)), sessions: sess };
}
function consistency(S){
  // planned training days in last 28 days (excluding today) vs sessions done in that window
  const today = isoDate(); let planned = 0;
  for (let i = 1; i <= 28; i++){ const d = addDays(today, -i); if (S.plan && S.plan.generatedAt && parseISO(d).getTime() < S.plan.generatedAt - 86400000) continue; if (isTrainingDay(S, d)) planned++; }
  const done = S.sessions.filter(s => s.end && s.date < today && daysBetween(s.date, today) <= 28).length;
  const score = planned ? Math.min(100, Math.round(done / planned * 100)) : null;
  // streak: consecutive weeks (completed weeks + current if on track) meeting the weekly target
  let streak = 0; let ws = weekStart(today);
  const cur = weekStats(S, today); if (cur.done >= cur.target) streak++;
  for (let k = 1; k < 52; k++){ const w = weekStats(S, addDays(ws, -7*k)); if (w.done >= w.target && w.done > 0) streak++; else break; }
  return { score, planned, done, weekStreak: streak };
}

/* ---------- Progressive overload ---------- */
function exerciseHistory(S, exId, beforeId){
  const out = [];
  const sorted = S.sessions.filter(s => s.end && s.id !== beforeId).sort((a,b) => b.start - a.start);
  for (const s of sorted){ for (const e of s.exercises){ if (e.exId === exId && e.sets.some(x => x.done)) out.push({ date:s.date, sessionId:s.id, ...e }); } }
  return out;
}
function doneSets(e){ return e.sets.filter(s => s.done && s.r > 0); }
function bestE1rm(e){ return Math.max(0, ...doneSets(e).map(s => e1rm(s.w, s.r))); }
function topWeight(e){ return Math.max(0, ...doneSets(e).map(s => s.w || 0)); }
function suggestNext(S, exId, planned, opts){
  opts = opts || {};
  const ex = EXERCISES[exId] || { inc:2.5, ratio:0, name:exId };
  const inc = ex.inc || 2.5; const bw = !ex.ratio;
  const hist = exerciseHistory(S, exId, opts.excludeSession);
  const deload = opts.deload;
  if (!hist.length){
    const w = planned.start || 0;
    return { weight:w, reps:planned.repMin, action:'start', reason: bw
      ? `No history yet. Do controlled reps aiming for ${planned.repMin}-${planned.repMax}, stopping 2-3 reps before failure. This session sets your baseline.`
      : `No history yet. Start at about ${w} kg (an estimate from your profile), keep 2-3 reps in reserve and adjust after the first set. This session sets your baseline.` };
  }
  const last = hist[0]; const sets = doneSets(last);
  const w = topWeight(last);
  const atTop = sets.filter(s => (s.w || 0) >= w);
  const rpes = sets.map(s => s.rpe).filter(Boolean);
  const avgRpe = avg(rpes);
  const pain = last.sets.some(s => s.pain);
  const allMax = atTop.length >= Math.min(planned.sets, sets.length) && atTop.every(s => s.r >= planned.repMax);
  const allMin = atTop.every(s => s.r >= planned.repMin);
  let res;
  if (pain){
    res = { weight: bw ? 0 : roundTo(w * 0.9, inc), reps: planned.repMin, action:'reduce', reason:`You flagged pain on this exercise last time (${last.date}). Use a lighter load or swap to an alternative, and stop if it hurts. Persistent pain is worth checking with a physio.` };
  } else if (allMax && (avgRpe == null || avgRpe <= 8.5) && !last.techIssue){
    if (bw) res = { weight:0, reps: planned.repMax + 1, action:'increase', reason:`You hit ${planned.repMax}+ reps on every set${avgRpe?` at about RPE ${r1(avgRpe)}`:''}. Add a rep per set, a slower tempo, or extra load (backpack/vest).` };
    else res = { weight: r1(w + inc), reps: planned.repMin, action:'increase', reason:`All ${atTop.length} sets reached ${planned.repMax} reps at ${w} kg${avgRpe?` with average RPE ${r1(avgRpe)}`:''}. Add ${inc} kg and work from ${planned.repMin} reps back up.` };
  } else if (allMax){
    res = { weight: w, reps: planned.repMax, action:'hold', reason:`You got the reps at ${w || 'bodyweight'}${w?' kg':''} but effort was high (RPE ${r1(avgRpe)}). Repeat it until it feels like RPE 8 or less before adding load.` };
  } else if (last.techIssue){
    res = { weight: w, reps: planned.repMin, action:'hold', reason:`You noted a technique issue last session. Keep ${w ? w + ' kg' : 'the same load'} and make every rep clean before progressing.` };
  } else if (allMin){
    res = { weight: w, reps: Math.min(planned.repMax, Math.max(...atTop.map(s => s.r)) + 1), action:'reps', reason:`You're inside the ${planned.repMin}-${planned.repMax} range at ${w ? w + ' kg' : 'bodyweight'}. Keep the weight and add a rep to any set you can. Increase load once every set hits ${planned.repMax}.` };
  } else {
    const prev = hist[1];
    const prevMissed = prev && topWeight(prev) >= w && doneSets(prev).filter(s => (s.w||0) >= w).some(s => s.r < planned.repMin);
    if (prevMissed && !bw) res = { weight: roundTo(w * 0.9, inc), reps: planned.repMin, action:'reduce', reason:`Reps fell below ${planned.repMin} at ${w} kg in two sessions in a row. Drop about 10% and build back up with clean reps.` };
    else res = { weight: w, reps: planned.repMin, action:'hold', reason:`Some sets fell short of ${planned.repMin} reps last time. Repeat ${w ? w + ' kg' : 'it'}; one tough day is not a trend. Check sleep and food if it repeats.` };
  }
  if (deload && !bw){ res.weight = roundTo((res.weight || w) * 0.85, inc); res.action = 'deload'; res.reason = 'Deload week: use about 85% of your normal load, fewer sets, and leave 3-4 reps in reserve. ' + res.reason; }
  res.last = { date:last.date, sets: sets.map(s => ({ w:s.w, r:s.r, rpe:s.rpe })) };
  return res;
}
function plateaus(S){
  const ids = new Set(); S.sessions.forEach(s => s.exercises.forEach(e => ids.add(e.exId)));
  const out = [];
  ids.forEach(id => {
    const h = exerciseHistory(S, id).filter(e => EXERCISES[id] && EXERCISES[id].ratio);
    if (h.length < 4) return;
    const recent = Math.max(...h.slice(0,3).map(bestE1rm));
    const before = Math.max(...h.slice(3).map(bestE1rm));
    if (recent <= before * 1.005) out.push({ exId:id, name:EXERCISES[id].name, sessions:h.length, best:r1(before), recent:r1(recent) });
  });
  return out;
}
function detectPRs(S, session){
  const prs = [];
  for (const e of session.exercises){
    const sets = doneSets(e); if (!sets.length) continue;
    const hist = exerciseHistory(S, e.exId, session.id);
    const name = (EXERCISES[e.exId] || {}).name || e.name;
    if (!hist.length) continue; // first time is a baseline, not a PR
    const prevW = Math.max(0, ...hist.map(topWeight));
    const prevE = Math.max(0, ...hist.map(bestE1rm));
    const prevR = Math.max(0, ...hist.map(h => Math.max(0, ...doneSets(h).map(s => s.r))));
    const w = topWeight(e), est = bestE1rm(e), reps = Math.max(...sets.map(s=>s.r));
    if (w > 0 && w > prevW) prs.push({ exId:e.exId, name, type:'Heaviest weight', value: w + ' kg' });
    else if (est > 0 && est > prevE * 1.001) prs.push({ exId:e.exId, name, type:'Estimated 1RM', value: r1(est) + ' kg' });
    else if (w === 0 && reps > prevR) prs.push({ exId:e.exId, name, type:'Most reps', value: reps + ' reps' });
  }
  return prs;
}
function sessionVolume(s){ return Math.round(sum(s.exercises.map(e => sum(doneSets(e).map(x => (x.w||0) * x.r))))); }
function deloadCheck(S){
  const reasons = [];
  const today = isoDate();
  const lastDeload = (S.sched || {}).lastDeload;
  const recent = S.sessions.filter(s => s.end).sort((a,b)=>a.start-b.start);
  if (recent.length){
    const since = lastDeload && lastDeload > recent[0].date ? lastDeload : recent[0].date;
    const weeks = Math.floor(daysBetween(since, today) / 7);
    const perWeek = recent.filter(s => s.date >= since).length / Math.max(1, weeks);
    if (weeks >= 6 && perWeek >= 2.5) reasons.push(`${weeks} weeks of steady training since your last lighter week.`);
  }
  const pl = plateaus(S); if (pl.length >= 3) reasons.push(`${pl.length} lifts have stalled for 3+ sessions.`);
  const sleep = avg(Object.entries(S.habits || {}).filter(([d]) => daysBetween(d, today) <= 7 && daysBetween(d, today) >= 0).map(([,h]) => h.sleep));
  const rpe = avg(recent.filter(s => daysBetween(s.date, today) <= 7).map(s => s.avgRpe));
  if (sleep != null && sleep < 6 && rpe != null && rpe >= 8.8) reasons.push(`Sleep averaged ${r1(sleep)} h this week while sessions felt very hard (RPE ${r1(rpe)}).`);
  const sore = avg(Object.entries(S.habits || {}).filter(([d]) => daysBetween(d, today) <= 5 && daysBetween(d, today) >= 0).map(([,h]) => h.soreness));
  if (sore != null && sore >= 4) reasons.push('You have logged high soreness several days running.');
  return { suggest: reasons.length > 0 && (reasons.length >= 2 || reasons[0].includes('weeks')), reasons };
}

/* ---------- Nutrition ---------- */
const ACTIVITY = { sedentary:{f:1.2,label:'Mostly sitting'}, light:{f:1.375,label:'On my feet some of the day'}, moderate:{f:1.55,label:'On my feet most of the day'}, active:{f:1.725,label:'Physical job'}, very:{f:1.9,label:'Heavy manual work'} };
function nutritionTargets(profile){
  const w = profile.weightKg, h = profile.heightCm, a = profile.age;
  if (!w || !h || !a) return null;
  const sexOff = profile.sex === 'male' ? 5 : profile.sex === 'female' ? -161 : -78;
  const bmr = 10*w + 6.25*h - 5*a + sexOff;
  const days = profile.daysPerWeek || 3;
  const act = (ACTIVITY[profile.activity] || ACTIVITY.light).f + Math.min(days, 6) * 0.025;
  const tdee = bmr * act;
  let kcal = tdee, note = 'Maintenance';
  const g = profile.goal;
  if (g === 'fat_loss'){ const def = Math.min(500, tdee * 0.18); kcal = tdee - def; note = `About ${Math.round(def)} kcal below estimated maintenance (roughly 0.3-0.5 kg/week)`; }
  else if (g === 'muscle_gain'){ kcal = tdee + Math.min(350, tdee * 0.1); note = 'Small surplus for lean gain (roughly 0.25 kg/week)'; }
  else if (g === 'recomp'){ kcal = tdee - Math.min(250, tdee * 0.08); note = 'Slight deficit with high protein'; }
  else if (g === 'strength'){ kcal = tdee + 150; note = 'Slightly above maintenance to support strength'; }
  const floor = profile.sex === 'male' ? 1600 : profile.sex === 'female' ? 1300 : 1450;
  kcal = Math.max(kcal, floor, bmr * 1.05);
  const protW = (g === 'fat_loss' && profile.targetWeight && profile.targetWeight < w) ? Math.max(profile.targetWeight, w * 0.85) : w;
  const pPerKg = g === 'fat_loss' || g === 'recomp' ? 2.0 : g === 'muscle_gain' || g === 'strength' ? 1.8 : 1.6;
  const p = Math.round(protW * pPerKg);
  const f = Math.round(Math.max(kcal * 0.27 / 9, w * 0.6));
  const c = Math.max(50, Math.round((kcal - p*4 - f*9) / 4));
  kcal = Math.round((p*4 + f*9 + c*4) / 10) * 10;
  return { kcal, p, c, f, fib: Math.round(kcal / 1000 * 14), water: Math.round((w * 35 + 500) / 250) * 250, bmr: Math.round(bmr), tdee: Math.round(tdee), note, pPerKg };
}
function foodMacros(foodId, grams, custom){
  const f = FOODS[foodId] || (custom || {})[foodId]; if (!f) return { kcal:0,p:0,c:0,f:0,fib:0 };
  const k = grams / 100;
  return { kcal: f.kcal*k, p: f.p*k, c: f.c*k, f: f.f*k, fib: (f.fib||0)*k };
}
function addMacros(a, b){ return { kcal:a.kcal+b.kcal, p:a.p+b.p, c:a.c+b.c, f:a.f+b.f, fib:(a.fib||0)+(b.fib||0) }; }
const ZERO = () => ({ kcal:0,p:0,c:0,f:0,fib:0 });
function itemsMacros(items, custom){ return items.reduce((m, [id, g]) => addMacros(m, foodMacros(id, g, custom)), ZERO()); }
function mealAllowed(meal, profile){
  const d = profile.diet || {};
  const banned = new Set();
  if (d.pref === 'vegetarian') ['meat','fish','shellfish'].forEach(t => banned.add(t));
  if (d.pref === 'pescatarian') banned.add('meat');
  if (d.pref === 'vegan') ['meat','fish','shellfish','dairy','egg'].forEach(t => banned.add(t));
  (d.flags || []).forEach(fl => { if (fl === 'dairy_free') banned.add('dairy'); if (fl === 'gluten_free') banned.add('gluten'); if (fl === 'nut_free') banned.add('nuts'); if (fl === 'egg_free') banned.add('egg'); if (fl === 'soy_free') banned.add('soy'); if (fl === 'shellfish_free') banned.add('shellfish'); });
  const words = ((d.allergies || '') + ',' + (d.dislikes || '')).toLowerCase().split(/[,;\n]/).map(s => s.trim()).filter(s => s.length > 2);
  for (const [id] of meal.items){
    const f = FOODS[id]; if (!f) continue;
    if (d.pref === 'vegan' && id === 'honey') return false;
    if (f.tags.some(t => banned.has(t))) return false;
    if (words.some(w => f.name.toLowerCase().includes(w) || id.includes(w) || f.tags.includes(w))) return false;
  }
  return true;
}
const SLOT_SHARE = { breakfast:0.25, lunch:0.3, dinner:0.3, snack:0.15 };
const SLOTS = ['breakfast','lunch','dinner','snack'];
function scaleMeal(meal, targetKcal, custom){
  const base = itemsMacros(meal.items, custom);
  const factor = Math.max(0.6, Math.min(1.9, targetKcal / Math.max(1, base.kcal)));
  const items = meal.items.map(([id, g]) => [id, Math.max(5, roundTo(g * factor, g * factor > 60 ? 10 : 5))]);
  return { mealId: meal.id, items, macros: itemsMacros(items, custom) };
}
function seededPick(arr, seed){ return arr[Math.abs(seed) % arr.length]; }
function mealPool(profile, slot, budgetMode){
  let list = MEALS.filter(m => m.slot === slot && mealAllowed(m, profile));
  if (budgetMode) list = list.slice().sort((a,b) => a.budget - b.budget);
  return list;
}
function generateDay(profile, targets, seed, opts){
  opts = opts || {};
  const day = {};
  SLOTS.forEach((slot, i) => {
    const pool = opts.pools ? opts.pools[slot] : mealPool(profile, slot, opts.budget);
    if (!pool || !pool.length) return;
    const meal = seededPick(pool, seed + i * 7);
    day[slot] = scaleMeal(meal, targets.kcal * SLOT_SHARE[slot], opts.custom);
  });
  return day;
}
function generateWeek(profile, targets, opts){
  opts = opts || {}; const seed = opts.seed || 1;
  // Small rotating pool per slot so ingredients repeat and less food is wasted
  const sizes = { breakfast:2, lunch:2, dinner:3, snack:2 };
  const pools = {};
  SLOTS.forEach((slot, i) => {
    const all = mealPool(profile, slot, opts.budget);
    const keep = (opts.favourites || []).map(id => all.find(m => m.id === id)).filter(Boolean);
    const rest = all.filter(m => !keep.includes(m));
    const off = (seed * (i + 3)) % Math.max(1, rest.length);
    const rotated = rest.slice(off).concat(rest.slice(0, off));
    pools[slot] = keep.concat(rotated).slice(0, Math.max(sizes[slot], keep.length));
  });
  const days = [];
  for (let d = 0; d < 7; d++){
    const day = {};
    SLOTS.forEach(slot => { const pool = pools[slot]; if (!pool.length) return; const meal = pool[d % pool.length]; day[slot] = scaleMeal(meal, targets.kcal * SLOT_SHARE[slot], opts.custom); });
    days.push(day);
  }
  return days;
}
function dayMacros(day){ return SLOTS.reduce((m, s) => day[s] ? addMacros(m, day[s].macros) : m, ZERO()); }
function groceryList(days){
  const agg = {};
  days.forEach(day => SLOTS.forEach(s => { if (day[s]) day[s].items.forEach(([id, g]) => { agg[id] = (agg[id] || 0) + g; }); }));
  const cats = { protein:'Protein', dairy:'Dairy & alternatives', carb:'Grains & starches', veg:'Vegetables', fruit:'Fruit', fat:'Oils, nuts & spreads' };
  const out = {};
  Object.entries(agg).forEach(([id, g]) => { const f = FOODS[id]; if (!f) return; const c = cats[f.cat] || 'Other'; (out[c] = out[c] || []).push({ id, name:f.name, grams: Math.round(g/10)*10, cost: f.price * g / 100 }); });
  return out;
}
function substituteItem(item, newId, custom){
  const [oldId, g] = item;
  const oldK = foodMacros(oldId, g, custom).kcal; const per = (FOODS[newId] || (custom||{})[newId]).kcal / 100;
  return [newId, Math.max(5, roundTo(oldK / Math.max(0.1, per), 5))];
}
function foodDayTotals(dayLog){ return (dayLog && dayLog.entries || []).reduce((m, e) => addMacros(m, { kcal:e.kcal||0, p:e.p||0, c:e.c||0, f:e.f||0, fib:e.fib||0 }), ZERO()); }

/* ---------- Body ---------- */
function bodySeries(S, field){ return (S.body.entries || []).filter(e => e[field] != null && e[field] !== '').map(e => ({ date:e.date, v:+e[field] })).sort((a,b) => a.date < b.date ? -1 : 1); }
function latestWeight(S){ const s = bodySeries(S, 'weight'); return s.length ? s[s.length-1].v : S.profile.weightKg; }
function weightTrend(S, days){
  const s = bodySeries(S, 'weight'); const today = isoDate();
  const win = s.filter(x => daysBetween(x.date, today) <= days);
  if (win.length < 2) return null;
  const n = win.length, xs = win.map(x => daysBetween(win[0].date, x.date)), ys = win.map(x => x.v);
  const mx = avg(xs), my = avg(ys);
  const slope = sum(xs.map((x,i) => (x-mx)*(ys[i]-my))) / Math.max(1e-9, sum(xs.map(x => (x-mx)**2)));
  return { perWeek: r1(slope * 7 * 10) / 10, n };
}

/* ---------- Weekly report ---------- */
function weeklyReport(S, refDate){
  const wk = weekStats(S, refDate);
  const prev = weekStats(S, addDays(wk.ws, -7));
  const T = nutritionTargets(S.profile);
  const recorded = [], improved = [], progressing = [], concerns = [], recs = [];
  recorded.push(`${wk.done} of ${wk.target} planned sessions completed`);
  if (wk.volume) recorded.push(`Training volume ${wk.volume.toLocaleString()} kg${prev.volume ? ` (${wk.volume >= prev.volume ? '+' : ''}${Math.round((wk.volume - prev.volume) / prev.volume * 100)}% vs previous week)` : ''}`);
  // exercise progress
  const prsThisWeek = wk.sessions.flatMap(s => s.prs || []);
  prsThisWeek.forEach(p => improved.push(`${p.name}: ${p.type} ${p.value}`));
  const exIds = new Set(wk.sessions.flatMap(s => s.exercises.map(e => e.exId)));
  exIds.forEach(id => {
    const h = exerciseHistory(S, id); const thisWeek = h.filter(e => e.date >= wk.ws && e.date <= wk.we); const before = h.filter(e => e.date < wk.ws);
    if (!thisWeek.length || !before.length || !EXERCISES[id] || !EXERCISES[id].ratio) return;
    const a = Math.max(...thisWeek.map(bestE1rm)), b = bestE1rm(before[0]);
    if (a > b * 1.005) progressing.push(`${EXERCISES[id].name} (est. 1RM ${r1(b)} → ${r1(a)} kg)`);
  });
  // nutrition
  let nutr = null;
  const days = []; for (let i = 0; i < 7; i++){ const d = addDays(wk.ws, i); if (d > isoDate()) break; const t = foodDayTotals((S.food || {})[d]); days.push({ d, t, logged: !!((S.food||{})[d] && S.food[d].entries && S.food[d].entries.length), water: ((S.food||{})[d] || {}).water || 0 }); }
  const logged = days.filter(x => x.logged);
  if (T){
    const within = logged.filter(x => Math.abs(x.t.kcal - T.kcal) <= T.kcal * 0.1).length;
    const protHit = logged.filter(x => x.t.p >= T.p * 0.9).length;
    nutr = { loggedDays: logged.length, elapsed: days.length, within, protHit, avgKcal: logged.length ? Math.round(avg(logged.map(x => x.t.kcal))) : null, avgP: logged.length ? Math.round(avg(logged.map(x => x.t.p))) : null, target:T };
    recorded.push(logged.length ? `Food logged on ${logged.length} of ${days.length} days; average ${nutr.avgKcal} kcal and ${nutr.avgP} g protein (estimates)` : 'No food logged this week');
  }
  const sleep = avg(days.map(x => (S.habits[x.d] || {}).sleep));
  if (sleep != null) recorded.push(`Average sleep ${r1(sleep)} h`);
  const wt = weightTrend(S, 21);
  if (wt) recorded.push(`Body weight trend ${wt.perWeek > 0 ? '+' : ''}${wt.perWeek} kg/week over the last 3 weeks`);
  // concerns
  const pl = plateaus(S); pl.slice(0,3).forEach(p => concerns.push(`${p.name} has not improved in the last 3 sessions`));
  if (sleep != null && sleep < 6.5) concerns.push('Sleep below 6.5 h on average, which slows recovery');
  const rpe = avg(wk.sessions.map(s => s.avgRpe)); if (rpe != null && rpe >= 9) concerns.push(`Sessions felt very hard (average RPE ${r1(rpe)})`);
  const dl = deloadCheck(S);
  // recommendations (rule-based)
  let elapsedTarget = 0; for (let i = 0; i < 7; i++){ const d = addDays(wk.ws, i); if (d < isoDate() && isTrainingDay(S, d) && (!S.profile.createdAt || d >= S.profile.createdAt)) elapsedTarget++; }
  if (wk.done < elapsedTarget) recs.push(`Lock in your training days: you're ${elapsedTarget - wk.done} session${elapsedTarget - wk.done > 1 ? 's' : ''} behind. Missed sessions roll forward automatically, so just do the next one.`);
  if (dl.suggest) recs.push('Take a lighter week: about 85% of normal loads and one fewer set per exercise. ' + dl.reasons[0]);
  if (nutr && nutr.loggedDays >= 3 && nutr.protHit < nutr.loggedDays * 0.7) recs.push(`Protein hit target on only ${nutr.protHit} of ${nutr.loggedDays} logged days. Add a protein-rich snack (yoghurt, shake or eggs) to close the ~${Math.max(0, T.p - (nutr.avgP||0))} g gap.`);
  if (nutr && nutr.loggedDays < 3) recs.push('Log food on at least 4 days next week so calorie and protein advice is based on real numbers.');
  if (pl.length) recs.push(`For ${pl[0].name}, try adding a rep before adding weight, or swap to a close alternative for 3-4 weeks.`);
  if (sleep != null && sleep < 7) recs.push('Aim for 7+ hours of sleep: a fixed bedtime and no screens 30 minutes before bed help most.');
  if (wt && S.profile.goal === 'fat_loss' && wt.perWeek > -0.1) recs.push('Weight is flat over 3 weeks. Reduce intake by about 150 kcal/day or add 2,000 daily steps.');
  if (wt && S.profile.goal === 'muscle_gain' && wt.perWeek < 0.05) recs.push('Weight is not rising. Add about 150 kcal/day (a bowl of oats or an extra snack).');
  if (wt && S.profile.goal === 'fat_loss' && wt.perWeek < -1) recs.push('Weight is dropping faster than 1 kg/week. Add about 150-200 kcal/day to protect muscle and energy.');
  const generic = ['Beat one number from last week on each main lift: a rep or 2.5 kg.', 'Walk 7,000+ steps on rest days to support recovery.', 'Prep two lunches in advance to make the nutrition plan easier.'];
  while (recs.length < 3) recs.push(generic[recs.length % generic.length]);
  return { ...wk, prev, recorded, improved, progressing, concerns, recs: recs.slice(0,3), nutr, sleep, deload: dl };
}

/* ---------- AI context and rule-based coach ---------- */
function coachContext(S){
  const P = S.profile; const T = nutritionTargets(P);
  const lines = [];
  lines.push(`PROFILE: age ${P.age||'?'}, sex ${P.sex||'not given'}, height ${P.heightCm||'?'} cm, start weight ${P.weightKg||'?'} kg, latest weight ${latestWeight(S)||'?'} kg, goal ${P.goal}, target weight ${P.targetWeight||'none'}, target date ${P.targetDate||'none'}, experience ${P.experience}, ${P.daysPerWeek} days/week, ${P.duration} min sessions, equipment ${P.equipment}, limitations: ${(P.limitations||[]).join(', ')||'none'}; avoid: ${P.avoid||'none'}; diet ${((P.diet||{}).pref)||'no preference'}, allergies ${(P.diet||{}).allergies||'none'}, dislikes ${(P.diet||{}).dislikes||'none'}.`);
  if (T) lines.push(`NUTRITION TARGETS (estimates): ${T.kcal} kcal, ${T.p} g protein, ${T.c} g carbs, ${T.f} g fat, water ${T.water} ml.`);
  if (S.plan){
    lines.push(`PLAN: ${S.plan.splitLabel}, training days ${S.plan.trainDays.map(d => DAY_NAMES[d]).join(' ')}.`);
    S.plan.workouts.forEach(w => lines.push(`- ${w.name}: ${w.exercises.map(e => `${(EXERCISES[e.exId]||{}).name} ${e.sets}x${e.repMin}-${e.repMax}`).join('; ')}`));
    const tp = todayPlan(S); lines.push(`TODAY (${isoDate()}, ${DAY_NAMES[dowOf(isoDate())]}): ${tp && tp.workoutId ? 'scheduled ' + workoutById(S, tp.workoutId).name : tp && tp.done && tp.done.length ? 'already trained' : 'rest day'}.`);
  }
  const sess = S.sessions.filter(s => s.end).sort((a,b) => b.start - a.start).slice(0, 12);
  lines.push(`RECORDED SESSIONS (${S.sessions.filter(s=>s.end).length} total; most recent first):` + (sess.length ? '' : ' none recorded yet.'));
  sess.forEach(s => lines.push(`- ${s.date} ${s.name}, ${s.durationMin} min, volume ${s.volume} kg, avg RPE ${s.avgRpe ? r1(s.avgRpe) : 'n/a'}: ` + s.exercises.map(e => `${(EXERCISES[e.exId]||{}).name||e.name} [${doneSets(e).map(x => `${x.w||'BW'}x${x.r}${x.rpe?'@'+x.rpe:''}${x.pain?' PAIN':''}`).join(', ')}]${e.note?' note: '+e.note:''}`).join('; ')));
  const pl = plateaus(S); if (pl.length) lines.push('PLATEAUS: ' + pl.map(p => p.name).join(', '));
  const bw = bodySeries(S, 'weight').slice(-10); lines.push('BODY WEIGHT LOG: ' + (bw.length ? bw.map(x => `${x.date} ${x.v}kg`).join(', ') : 'none'));
  const meas = (S.body.entries||[]).slice(-3).map(e => `${e.date}: ${['waist','chest','arm','thigh','hip','bf'].filter(k => e[k]).map(k => k+' '+e[k]).join(', ')}`).filter(x => x.includes(' ')); if (meas.length) lines.push('MEASUREMENTS: ' + meas.join(' | '));
  const fd = []; for (let i = 0; i < 7; i++){ const d = addDays(isoDate(), -i); const t = foodDayTotals((S.food||{})[d]); if (t.kcal) fd.push(`${d}: ${Math.round(t.kcal)} kcal, ${Math.round(t.p)} g P`); }
  lines.push('FOOD LOG LAST 7 DAYS: ' + (fd.length ? fd.join('; ') : 'nothing logged'));
  const hb = []; for (let i = 0; i < 7; i++){ const d = addDays(isoDate(), -i); const h = (S.habits||{})[d]; if (h) hb.push(`${d}: sleep ${h.sleep||'?'}h, steps ${h.steps||'?'}, soreness ${h.soreness||'?'}/5`); }
  lines.push('RECOVERY LOG: ' + (hb.length ? hb.join('; ') : 'nothing logged'));
  return lines.join('\n');
}
function ruleCoach(S, q){
  q = q.toLowerCase();
  const tp = todayPlan(S); const T = nutritionTargets(S.profile);
  const sessions = S.sessions.filter(s => s.end);
  if (/protein|\beat\b|food|meal|calorie/.test(q)){
    if (!T) return 'Add age, height and weight in your profile to get nutrition targets.';
    const t = foodDayTotals((S.food||{})[isoDate()]); const gap = Math.max(0, Math.round(T.p - t.p));
    return `Target today: ${T.kcal} kcal and ${T.p} g protein (estimates). Logged so far: ${Math.round(t.kcal)} kcal, ${Math.round(t.p)} g protein. ${gap ? `To close the ${gap} g gap: 150 g chicken breast (~46 g), 200 g Greek yoghurt (~20 g), a whey shake (~23 g) or 200 g tofu (~32 g).` : 'You have hit your protein target.'}`;
  }
  if (/today|what (workout|should i (do|train))/.test(q)){
    if (!tp) return 'Finish setting up your profile and I will build your plan.';
    if (tp.done && tp.done.length) return `You've already trained today (${tp.done[0].name}). Recover: walk, stretch, eat your protein and sleep 7+ hours.`;
    if (tp.workoutId){ const w = workoutById(S, tp.workoutId); return `Today is ${w.name} (${w.focus}): ${w.exercises.map(e => EXERCISES[e.exId].name).join(', ')}. About ${estimateDuration(w)} minutes. Tap Start Workout when you're ready.`; }
    const next = projectSchedule(S, isoDate(), 8).find(x => x.workoutId);
    return `Today is a rest day. ${next ? `Next up: ${workoutById(S, next.workoutId).name} on ${DAY_NAMES[dowOf(next.date)]}.` : ''} A 20-minute walk or the mobility flow helps recovery.`;
  }
  if (/30 ?min|short on time|only have|quick/.test(q)){
    const w = tp && tp.workoutId ? workoutById(S, tp.workoutId) : S.plan && workoutById(S, S.plan.rotation[S.plan.pointer % S.plan.rotation.length]);
    if (!w) return 'Set up your plan first.';
    const top = w.exercises.filter(e => EXERCISES[e.exId].compound).slice(0,3);
    return `For 30 minutes, do the first ${top.length} compound lifts of ${w.name}: ${top.map(e => `${EXERCISES[e.exId].name} ${Math.max(2, e.sets-1)} sets`).join(', ')}. Shorten rests to 60-90 s and skip the isolation work. That keeps about 80% of the training effect.`;
  }
  if (/replace|swap|alternative|instead of/.test(q)){
    const hit = Object.values(EXERCISES).find(e => q.includes(e.name.toLowerCase().split(' (')[0].toLowerCase()) || q.includes(e.id.replace(/-/g,' ')));
    if (hit) return `Alternatives for ${hit.name}: ${hit.alt.map(a => EXERCISES[a] && EXERCISES[a].name).filter(Boolean).join(', ')}. In a workout, tap the ⋯ on the exercise and choose Swap.`;
    return 'Tell me which exercise (for example "replace barbell bench press"), or tap ⋯ → Swap on the exercise during a workout.';
  }
  if (/weight.*(next|use)|next set|how heavy/.test(q)){
    const w = tp && tp.workoutId ? workoutById(S, tp.workoutId) : null;
    if (!w) return 'Open a workout and each exercise shows a suggested weight with the reason.';
    return w.exercises.slice(0,4).map(e => { const s = suggestNext(S, e.exId, e); return `${EXERCISES[e.exId].name}: ${s.weight ? s.weight + ' kg' : 'bodyweight'} × ${s.reps}. ${s.reason}`; }).join('\n\n');
  }
  if (/stall|plateau|stuck|not progress/.test(q)){
    const pl = plateaus(S);
    if (sessions.length < 6) return `You have ${sessions.length} recorded sessions. I need at least 4 sessions of the same exercise to spot a plateau.`;
    if (!pl.length) return 'No lifts have stalled: each main exercise improved its estimated 1RM within the last 3 sessions.';
    const dl = deloadCheck(S);
    return `Stalled: ${pl.map(p => p.name).join(', ')}. Likely causes to check: ${dl.reasons.join(' ') || 'sleep, calorie intake and rep quality'}. Options: hold the weight and add reps, take a lighter week, or swap to a variation for 3-4 weeks.`;
  }
  if (/stronger|progress|improv/.test(q) && !/month/.test(q)){
    if (sessions.length < 2) return 'I need at least two recorded sessions to compare. Log a couple of workouts and ask again.';
    const ids = [...new Set(sessions.flatMap(s => s.exercises.map(e => e.exId)))].filter(id => EXERCISES[id] && EXERCISES[id].ratio);
    const res = ids.map(id => { const h = exerciseHistory(S, id); if (h.length < 2) return null; const first = bestE1rm(h[h.length-1]), last = bestE1rm(h[0]); return { name:EXERCISES[id].name, first, last }; }).filter(Boolean);
    if (!res.length) return 'No exercise has two recorded sessions yet.';
    return res.map(r => `${r.name}: est. 1RM ${r1(r.first)} → ${r1(r.last)} kg (${r.last >= r.first ? '+' : ''}${r1(r.last - r.first)})`).join('\n');
  }
  if (/next week|focus/.test(q)){ const r = weeklyReport(S); return 'Next week:\n• ' + r.recs.join('\n• '); }
  if (/month|summar/.test(q)){
    const since = addDays(isoDate(), -30); const ms = sessions.filter(s => s.date >= since);
    const prs = ms.flatMap(s => s.prs || []);
    const bw = bodySeries(S, 'weight').filter(x => x.date >= since);
    return `Last 30 days (recorded data): ${ms.length} sessions, ${sum(ms.map(s=>s.volume)).toLocaleString()} kg total volume, ${prs.length} personal records${prs.length ? ' (' + prs.slice(0,4).map(p => p.name).join(', ') + ')' : ''}. ${bw.length >= 2 ? `Weight ${bw[0].v} → ${bw[bw.length-1].v} kg.` : 'Not enough weigh-ins to show a weight change.'}`;
  }
  return 'I can answer questions about today\'s workout, weights for your next sets, progress, plateaus, protein, swaps, short sessions and next week. Turn on AI answers (Claude) for open-ended questions.';
}

if (typeof module !== 'undefined') module.exports = { EXERCISES, FOODS, MEALS, generatePlan, suggestNext, nutritionTargets, generateWeek, generateDay, groceryList, dayMacros, weeklyReport, projectSchedule, plateaus, detectPRs, sessionVolume, deloadCheck, consistency, ruleCoach, coachContext, isoDate, addDays, mealAllowed, substituteItem, estimateDuration, weekStart };
/* ===== Weekly report engine (no DOM). Every figure comes from recorded data. ===== */
function weeksWithData(S){
  const set = new Set(S.sessions.filter(s => s.end).map(s => weekStart(s.date)));
  return [...set].sort().reverse();
}
function restGaps(sets){
  const ts = sets.map(s => s.t).filter(Boolean).sort((a,b) => a - b); const gaps = [];
  for (let i = 1; i < ts.length; i++){ const g = (ts[i] - ts[i-1]) / 1000; if (g > 5 && g < 900) gaps.push(g); }
  return gaps.length ? Math.round(avg(gaps)) : null;
}
function exVolume(e){ const ds = doneSets(e); if (!ds.some(s => s.w > 0)) return null; return Math.round(sum(ds.map(s => (s.w||0) * s.r))); }
function weekMetrics(S, ws){
  const we = addDays(ws, 6); const today = isoDate();
  const created = S.profile && S.profile.createdAt ? S.profile.createdAt : (S.plan ? isoDate(new Date(S.plan.generatedAt)) : ws);
  const sessions = S.sessions.filter(s => s.end && s.date >= ws && s.date <= we).sort((a,b) => a.start - b.start);
  const plannedDates = [], missedDates = [], rescheduled = [];
  for (let i = 0; i < 7; i++){
    const d = addDays(ws, i);
    if (d < created) continue;
    if (isTrainingDay(S, d)) { plannedDates.push(d); if (d < today && !sessionsOn(S, d).length) missedDates.push(d); }
    if (((S.sched||{}).rest||{})[d] || ((S.sched||{}).extra||{})[d]) rescheduled.push({ date:d, type: ((S.sched||{}).extra||{})[d] ? 'added' : 'rest' });
  }
  const sets = sum(sessions.map(s => s.exercises.reduce((n, e) => n + doneSets(e).length, 0)));
  const exercises = sum(sessions.map(s => s.exercises.length));
  const T = S.profile ? nutritionTargets(S.profile) : null;
  const foodDays = []; for (let i = 0; i < 7; i++){ const d = addDays(ws, i); if (d > today) break; const fd = (S.food||{})[d]; if (fd && fd.entries && fd.entries.length) foodDays.push(foodDayTotals(fd)); }
  const sleepVals = []; for (let i = 0; i < 7; i++){ const h = (S.habits||{})[addDays(ws, i)]; if (h && h.sleep) sleepVals.push(h.sleep); }
  const wts = bodySeries(S, 'weight').filter(x => x.date >= ws && x.date <= we);
  return {
    ws, we, sessions, planned: plannedDates.length, plannedDates, missedDates, rescheduled,
    completed: sessions.length, timeMin: sum(sessions.map(s => s.durationMin || 0)), exercises, sets,
    volume: sum(sessions.map(s => s.volume || 0)), pct: plannedDates.length ? Math.min(100, Math.round(sessions.length / plannedDates.length * 100)) : null,
    avgRpe: avg(sessions.map(s => s.avgRpe)), prs: sessions.flatMap(s => (s.prs || []).map(p => ({ ...p, date:s.date }))),
    foodDays: foodDays.length, avgKcal: foodDays.length ? Math.round(avg(foodDays.map(t => t.kcal))) : null, avgProtein: foodDays.length ? Math.round(avg(foodDays.map(t => t.p))) : null,
    proteinHit: T ? foodDays.filter(t => t.p >= T.p * 0.9).length : null, kcalWithin: T ? foodDays.filter(t => Math.abs(t.kcal - T.kcal) <= T.kcal * 0.1).length : null,
    avgSleep: sleepVals.length ? r1(avg(sleepVals)) : null, sleepDays: sleepVals.length,
    weightStart: wts.length ? wts[0].v : null, weightEnd: wts.length ? wts[wts.length-1].v : null, weighIns: wts.length,
    current: ws <= today && today <= we, future: ws > today,
  };
}
function workoutBreakdown(S, sessions){
  return sessions.map(s => {
    const w = S.plan && S.plan.workouts.find(x => x.id === s.workoutId);
    const muscles = [...new Set(s.exercises.flatMap(e => ((EXERCISES[e.exId] || {}).muscles || '').split(', ').filter(Boolean)))];
    return { id:s.id, date:s.date, name:s.name, focus: w ? w.focus : '', muscles, durationMin:s.durationMin, avgRpe:s.avgRpe, notes:s.notes || '', prs:s.prs || [], volume:s.volume,
      exercises: s.exercises.map(e => ({ exId:e.exId, name:(EXERCISES[e.exId] || {}).name || e.exId, sets: doneSets(e).map(x => ({ w:x.w || 0, r:x.r, rpe:x.rpe || null, pain:!!x.pain })), volume: exVolume(e), restAvg: restGaps(e.sets), plannedRest: e.plan ? e.plan.rest : null, note:e.note || '', swappedFrom:e.swappedFrom || null })) };
  });
}
function exerciseProgression(S, ws){
  const we = addDays(ws, 6);
  const inWeek = S.sessions.filter(s => s.end && s.date >= ws && s.date <= we);
  const ids = [...new Set(inWeek.flatMap(s => s.exercises.map(e => e.exId)))];
  const pl = new Set(plateaus(S).map(p => p.exId));
  return ids.map(id => {
    const ex = EXERCISES[id] || { name:id, ratio:1 }; const bw = !ex.ratio;
    const hist = exerciseHistory(S, id); // newest first
    const week = hist.filter(h => h.date >= ws && h.date <= we);
    const before = hist.filter(h => h.date < ws);
    const best = week.reduce((b, h) => bestE1rm(h) > bestE1rm(b) ? h : b, week[0]);
    const prs = inWeek.flatMap(s => (s.prs || []).filter(p => p.exId === id));
    const cur = { topW: Math.max(...week.map(topWeight)), e1: r1(Math.max(...week.map(bestE1rm))), reps: Math.max(...week.flatMap(h => doneSets(h).map(s => s.r))), vol: Math.round(avg(week.map(h => exVolume(h) || 0))), sets: best ? doneSets(best).map(s => ({ w:s.w, r:s.r })) : [] };
    if (!before.length) return { exId:id, name:ex.name, status:'baseline', cur, prev:null, prs, plateau:false, sessions: hist.length, text:'First time logged. This week is the baseline.' };
    const p = before[0];
    const prev = { date:p.date, topW: topWeight(p), e1: r1(bestE1rm(p)), reps: Math.max(...doneSets(p).map(s => s.r)), vol: exVolume(p) || 0, sets: doneSets(p).map(s => ({ w:s.w, r:s.r })) };
    const repsAt = (h, w) => Math.max(0, ...doneSets(h).filter(s => (s.w||0) >= w).map(s => s.r));
    let status, text;
    if (!bw && cur.topW > prev.topW){ status = 'weight_up'; text = `Top weight ${prev.topW} → ${cur.topW} kg.`; }
    else if ((bw || cur.topW === prev.topW) && Math.max(...week.map(h => repsAt(h, prev.topW))) > repsAt(p, prev.topW)){ status = 'reps_up'; text = `More reps at ${bw ? 'bodyweight' : prev.topW + ' kg'}: ${repsAt(p, prev.topW)} → ${Math.max(...week.map(h => repsAt(h, prev.topW)))}.`; }
    else if ((!bw && cur.topW < prev.topW) || (bw && cur.reps < prev.reps)){ status = 'down'; text = bw ? `Best set ${prev.reps} → ${cur.reps} reps.` : `Top weight ${prev.topW} → ${cur.topW} kg.`; }
    else { status = 'stable'; text = `Matched last time (${bw ? cur.reps + ' reps' : cur.topW + ' kg'}).`; }
    const volChange = prev.vol && cur.vol ? Math.round((cur.vol - prev.vol) / prev.vol * 100) : null;
    return { exId:id, name:ex.name, status, cur, prev, volChange, prs, plateau: pl.has(id) && status !== 'weight_up' && status !== 'reps_up', sessions: hist.length, text };
  }).sort((a,b) => ['weight_up','reps_up','stable','baseline','down'].indexOf(a.status) - ['weight_up','reps_up','stable','baseline','down'].indexOf(b.status));
}
function recoverySummary(S, m){
  const days = Array.from({ length:7 }, (_, i) => addDays(m.ws, i)).filter(d => d <= isoDate());
  const H = days.map(d => ({ d, h: (S.habits||{})[d] || {} }));
  const sleep = H.filter(x => x.h.sleep), sore = H.filter(x => x.h.soreness), energy = H.filter(x => x.h.energy), steps = H.filter(x => x.h.steps);
  const logged = sleep.length + sore.length + energy.length + steps.length > 0;
  const lines = [];
  if (sleep.length) lines.push(`Sleep averaged ${r1(avg(sleep.map(x => x.h.sleep)))} h over ${sleep.length} logged night${sleep.length>1?'s':''}.`);
  if (energy.length) lines.push(`Energy averaged ${r1(avg(energy.map(x => x.h.energy)))}/5 on ${energy.length} day${energy.length>1?'s':''}.`);
  if (sore.length) lines.push(`Soreness averaged ${r1(avg(sore.map(x => x.h.soreness)))}/5 on ${sore.length} day${sore.length>1?'s':''}.`);
  if (steps.length) lines.push(`Steps averaged ${Math.round(avg(steps.map(x => x.h.steps))).toLocaleString('en-AU')} a day.`);
  // Relationship: only when both groups exist
  let link = null;
  const sess = m.sessions.map(s => ({ s, sleep: ((S.habits||{})[s.date] || {}).sleep })).filter(x => x.sleep && x.s.avgRpe);
  const good = sess.filter(x => x.sleep >= 7), poor = sess.filter(x => x.sleep < 7);
  if (good.length && poor.length){ const a = r1(avg(good.map(x => x.s.avgRpe))), b = r1(avg(poor.map(x => x.s.avgRpe))); link = `Sessions after 7+ hours of sleep felt ${a < b ? 'easier' : a > b ? 'harder' : 'about the same'} (average RPE ${a} vs ${b} after shorter nights). That's from ${sess.length} sessions, so treat it as a hint, not proof.`; }
  const trainedDays = new Set(m.sessions.map(s => s.date)).size;
  let longestGap = 0, prev = null; m.sessions.forEach(s => { if (prev) longestGap = Math.max(longestGap, daysBetween(prev, s.date) - 1); prev = s.date; });
  return { logged, lines, link, trainedDays, restDays: days.length - trainedDays, longestGap, elapsed: days.length };
}
function coachReview(S, m, prog, rec){
  const P = S.profile; const T = nutritionTargets(P);
  const well = [], improved = [], focus = [], change = [], priorities = [];
  if (m.planned && m.pct >= 80) well.push(`Completed ${m.completed} of ${m.planned} planned sessions.`);
  if (m.prs.length) well.push(`${m.prs.length} personal record${m.prs.length>1?'s':''}: ${[...new Set(m.prs.map(p => p.name))].slice(0,3).join(', ')}.`);
  if (T && m.foodDays >= 3 && m.proteinHit >= m.foodDays * 0.7) well.push(`Protein target hit on ${m.proteinHit} of ${m.foodDays} logged days.`);
  if (m.avgSleep && m.avgSleep >= 7) well.push(`Sleep averaged ${m.avgSleep} h.`);
  prog.filter(p => p.status === 'weight_up' || p.status === 'reps_up').forEach(p => improved.push(`${p.name}: ${p.text}`));
  prog.filter(p => p.plateau || p.status === 'down').forEach(p => focus.push(`${p.name}: ${p.plateau ? 'no improvement in the last 3 sessions' : p.text}`));
  if (!focus.length && S.plan){ const main = [...new Set(S.plan.workouts.flatMap(w => w.exercises.filter(e => EXERCISES[e.exId].compound).slice(0,1).map(e => EXERCISES[e.exId].name)))].slice(0,3); if (main.length) focus.push(`Keep building your main lifts: ${main.join(', ')}.`); }
  let goal = { status:'unknown', text:'Not enough weigh-ins to judge progress toward your goal. Weigh in at least twice a week.' };
  const tr = weightTrend(S, 21);
  if (tr && tr.n >= 3){
    const want = P.goal === 'fat_loss' ? -1 : P.goal === 'muscle_gain' ? 1 : 0;
    if (want === -1) goal = tr.perWeek <= -0.15 ? { status:'on', text:`On track: weight is trending ${tr.perWeek} kg/week.` } : { status:'off', text:`Weight trend is ${tr.perWeek > 0 ? '+' : ''}${tr.perWeek} kg/week, slower than a typical fat-loss pace (0.3-0.7 kg/week).` };
    else if (want === 1) goal = tr.perWeek >= 0.1 ? { status:'on', text:`On track: weight is trending +${tr.perWeek} kg/week.` } : { status:'off', text:`Weight trend is ${tr.perWeek} kg/week; lean gain is usually +0.1-0.3 kg/week.` };
    else goal = { status: improved.length ? 'on' : 'unknown', text: `Weight is ${Math.abs(tr.perWeek) < 0.15 ? 'stable' : 'moving ' + tr.perWeek + ' kg/week'}; ${improved.length ? 'strength is improving, which fits your goal.' : 'judge progress by strength and measurements.'}` };
  }
  const wr = weeklyReport(S, m.ws);
  wr.recs.forEach(r => change.push(r));
  if (m.missedDates.length >= 2) change.unshift(`You missed ${m.missedDates.length} planned days. If the schedule is too ambitious, drop to ${Math.max(2, m.planned - 1)} days rather than skipping.`);
  if (improved.length) change.push('Maintain: keep the current exercise selection and rep ranges; they are producing progress.');
  priorities.push(...[...new Set(change)].slice(0,3));
  return { well, improved, focus, goal, change:[...new Set(change)].slice(0,4), priorities };
}
function nextWeekPlan(S){
  const today = isoDate(); const nws = addDays(weekStart(today), 7); const nwe = addDays(nws, 6);
  const span = daysBetween(today, nwe) + 1;
  const proj = projectSchedule(S, today, span).filter(d => d.date >= nws);
  const dl = deloadCheck(S);
  const days = proj.map(d => {
    if (!d.workoutId) return { date:d.date, rest:true };
    const w = workoutById(S, d.workoutId);
    return { date:d.date, workoutId:w.id, name:w.name, focus:w.focus, exercises: w.exercises.map(pe => { const s = suggestNext(S, pe.exId, pe, { deload: dl.suggest }); return { exId:pe.exId, name:EXERCISES[pe.exId].name, sets: dl.suggest ? Math.max(2, pe.sets - 1) : pe.sets, repMin:pe.repMin, repMax:pe.repMax, weight: s.weight, reps: s.reps, action: s.action, reason: s.reason, hasData: s.action !== 'start' }; }) };
  });
  const sore = avg(Array.from({ length:7 }, (_, i) => ((S.habits||{})[addDays(today, -i)] || {}).soreness));
  const recovery = [];
  const restDays = days.filter(d => d.rest).map(d => DAY_NAMES[dowOf(d.date)]);
  recovery.push(restDays.length ? `Rest days: ${restDays.join(', ')}. Easy walking or the mobility flow is ideal.` : 'No rest days scheduled: keep at least one full rest day.');
  if (dl.suggest) recovery.push('Deload recommended: about 85% loads and one fewer set. ' + dl.reasons[0]);
  if (sore && sore >= 3.5) recovery.push(`Soreness has averaged ${r1(sore)}/5: add 10 minutes of mobility after sessions and keep protein high.`);
  recovery.push('Aim for 7+ hours of sleep, especially the night before lower-body sessions.');
  const T = S.profile ? nutritionTargets(S.profile) : null; const m = weekMetrics(S, weekStart(today));
  const lastW = weekMetrics(S, addDays(weekStart(today), -7)); const nm = m.foodDays >= lastW.foodDays ? m : lastW;
  let nutrition = null;
  if (T){
    if (nm.foodDays >= 3){
      if (nm.avgProtein < T.p * 0.9) nutrition = `Protein averaged ${nm.avgProtein} g against a ${T.p} g target. Add one protein-rich snack a day (about 25-30 g).`;
      else if (Math.abs(nm.avgKcal - T.kcal) > T.kcal * 0.12) nutrition = `Calories averaged ${nm.avgKcal} kcal against ${T.kcal} kcal. Bring intake ${nm.avgKcal > T.kcal ? 'down' : 'up'} toward target. These are estimates.`;
      else nutrition = `Nutrition is close to target (${nm.avgKcal} kcal, ${nm.avgProtein} g protein average). Keep the same approach.`;
    } else nutrition = 'Log food on at least 4 days so nutrition advice is based on real intake.';
  }
  const wr = weeklyReport(S, today);
  return { ws:nws, we:nwe, days, deload: dl.suggest, deloadReasons: dl.reasons, recovery, nutrition, priorities: wr.recs.slice(0,3) };
}
function buildWeekReport(S, anyDate){
  const ws = weekStart(anyDate || isoDate());
  const m = weekMetrics(S, ws);
  const prevM = weekMetrics(S, addDays(ws, -7));
  const workouts = workoutBreakdown(S, m.sessions);
  const prog = exerciseProgression(S, ws);
  const rec = recoverySummary(S, m);
  const review = coachReview(S, m, prog, rec);
  const latest = ws >= addDays(weekStart(isoDate()), -7);
  return { ws, we:m.we, generatedAt: Date.now(), metrics:m, prev:prevM, workouts, progression:prog, recovery:rec, review, next: latest ? nextWeekPlan(S) : null, empty: !m.sessions.length };
}
function snapshotMetrics(m){ const { sessions, plannedDates, ...rest } = m; return { ...rest, prs: m.prs.length }; }
const COMPARE_ROWS = [['completed','Workouts completed',''],['planned','Workouts planned',''],['pct','Completion','%'],['timeMin','Training time',' min'],['sets','Working sets',''],['volume','Volume',' kg'],['avgRpe','Average RPE',''],['prs','Personal records',''],['avgKcal','Average calories',' kcal'],['avgProtein','Average protein',' g'],['avgSleep','Average sleep',' h']];
function compareWeeks(S, wsA, wsB){
  const a = snapshotMetrics(weekMetrics(S, wsA)), b = snapshotMetrics(weekMetrics(S, wsB));
  return COMPARE_ROWS.map(([k, label, unit]) => ({ key:k, label, unit, a: a[k] == null ? null : (k === 'avgRpe' ? r1(a[k]) : a[k]), b: b[k] == null ? null : (k === 'avgRpe' ? r1(b[k]) : b[k]) }));
}
if (typeof module !== 'undefined') Object.assign(module.exports, { buildWeekReport, weekMetrics, compareWeeks, weeksWithData, exerciseProgression, nextWeekPlan });
/* ===== Archery support: plan additions, warm-up, shooting days (no DOM) =====
   Additions are tagged { archery:true } so they can be removed again without touching the rest of the plan. */
const ARCHERY_WARMUP = [
  { exId:'band-pullapart', dose:'15 reps' }, { exId:'band-er', dose:'12 reps each arm' }, { exId:'ytw', dose:'5 of each letter' },
  { exId:'open-book', dose:'6 each side' }, { exId:'band-draw', dose:'8 slow draws each side' },
  { name:'Light practice ends', dose:'2-3 easy ends before full draws' },
];
function archeryOn(profile){ return !!(profile && profile.sport && profile.sport.archery); }
function shootingDay(profile, date){ return archeryOn(profile) && ((profile.sport.days || []).includes(dowOf(date))); }
function isUpperWorkout(w){ return w.exercises.some(e => { const x = EXERCISES[e.exId]; return x && ['hpull','vpull','hpush','vpush','rear-iso'].includes(x.pattern); }); }
function applyArchery(plan, profile, on){
  const p = JSON.parse(JSON.stringify(plan));
  const gym = profile.equipment === 'full'; const db = gym || profile.equipment === 'dumbbell';
  p.workouts.forEach(w => {
    w.exercises = w.exercises.filter(e => !e.archery);
    if (!on || w.tpl === 'mobility') return;
    const has = id => w.exercises.some(e => e.exId === id);
    const add = (exId, sets, repMin, repMax, rest) => { if (!has(exId)) w.exercises.push({ exId, sets, repMin, repMax, rest, start: 0, archery: true }); };
    if (isUpperWorkout(w)){
      add(gym ? 'face-pull' : 'band-pullapart', 2, 12, 15, 60);
      add('band-er', 2, 12, 15, 45);
      add('band-draw', 2, 8, 10, 45);
    } else {
      add('ytw', 2, 5, 8, 45);
      if (db) add('farmer-carry', 2, 30, 40, 75);
    }
  });
  p.archery = !!on;
  return p;
}
if (typeof module !== 'undefined') Object.assign(module.exports, { applyArchery, archeryOn, shootingDay, ARCHERY_WARMUP });
/* ===== Daily fuel plan: protein spread, pre/post-workout meals, optional supplements (no DOM) =====
   Built for beginners: simple times, real foods from the DrukFit food list, amounts scaled to the member's own
   protein target. Supplements are optional, off by default, and come with who-should-not-take-them notes. */
const FUEL_SOURCES = {
  protein: { name:'ISSN position stand: protein and exercise (Jäger et al., 2017)', url:'https://doi.org/10.1186/s12970-017-0177-8' },
  timing:  { name:'ISSN position stand: nutrient timing (Kerksick et al., 2017)', url:'https://doi.org/10.1186/s12970-017-0189-4' },
  creatine:{ name:'ISSN position stand: creatine supplementation (Kreider et al., 2017)', url:'https://doi.org/10.1186/s12970-017-0173-z' },
  caffeine:{ name:'ISSN position stand: caffeine and exercise performance (Guest et al., 2021)', url:'https://doi.org/10.1186/s12970-020-00383-4' },
  caffeineLimit:{ name:'US FDA: Spilling the Beans: How Much Caffeine Is Too Much?', url:'https://www.fda.gov/consumers/consumer-updates/spilling-beans-how-much-caffeine-too-much' },
  ais:     { name:'Australian Institute of Sport: Supplements', url:'https://www.ausport.gov.au/ais/nutrition/supplements' },
};
// Each option: the first item is the main protein food and is scaled to the meal's protein target.
const FUEL_OPTIONS = {
  breakfast: [
    { name:'Oats with milk and a scoop of protein', items:[['whey', 30], ['oats', 60], ['milk', 250], ['berries', 80]], scale:[20, 40] },
    { name:'Greek yoghurt bowl', items:[['greek-yoghurt', 250], ['oats', 40], ['berries', 100]], scale:[150, 350] },
    { name:'Eggs on wholegrain toast', items:[['egg', 150], ['wholegrain-bread', 80], ['spinach', 40]], scale:[100, 200] },
    { name:'Tofu scramble on toast', items:[['tofu', 200], ['wholegrain-bread', 80], ['capsicum', 60]], scale:[150, 300] },
  ],
  lunch: [
    { name:'Chicken, rice and salad', items:[['chicken-breast', 140], ['rice-cooked', 180], ['salad-mix', 120]], scale:[100, 220] },
    { name:'Tuna wrap', items:[['tuna', 95], ['wrap', 70], ['salad-mix', 100], ['avocado', 30]], scale:[70, 190] },
    { name:'Lentil and quinoa bowl', items:[['lentils', 250], ['quinoa-cooked', 120], ['spinach', 40], ['hummus', 30]], scale:[200, 350] },
    { name:'Tempeh stir-fry with rice', items:[['tempeh', 150], ['rice-cooked', 180], ['stir-fry-veg', 150]], scale:[100, 220] },
  ],
  pre: [
    { name:'Banana and Greek yoghurt', items:[['greek-yoghurt', 170], ['banana', 120]], scale:[120, 250] },
    { name:'Toast with peanut butter and a glass of milk', items:[['milk', 300], ['wholegrain-bread', 80], ['peanut-butter', 15]], scale:[200, 400] },
    { name:'Rice cakes with cottage cheese and honey', items:[['cottage-cheese', 150], ['rice-cakes', 30], ['honey', 10]], scale:[100, 250] },
    { name:'Soy milk smoothie with banana and oats', items:[['soy-milk', 350], ['banana', 120], ['oats', 30]], scale:[250, 500] },
  ],
  post: [
    { name:'Protein shake with milk and a banana', items:[['whey', 30], ['milk', 300], ['banana', 120]], scale:[25, 45] },
    { name:'Chicken and sweet potato', items:[['chicken-breast', 130], ['sweet-potato', 200], ['broccoli', 100]], scale:[100, 200] },
    { name:'Greek yoghurt, berries and honey', items:[['greek-yoghurt', 250], ['berries', 100], ['honey', 15]], scale:[170, 400] },
    { name:'Plant protein shake with soy milk and a banana', items:[['pea-protein', 30], ['soy-milk', 300], ['banana', 120]], scale:[25, 45] },
  ],
  snack: [
    { name:'Cottage cheese with fruit', items:[['cottage-cheese', 200], ['apple', 150]], scale:[150, 300] },
    { name:'Greek yoghurt and almonds', items:[['greek-yoghurt', 200], ['almonds', 20]], scale:[150, 300] },
    { name:'Edamame and an orange', items:[['edamame', 150], ['orange', 150]], scale:[100, 250] },
    { name:'Protein bar and fruit', items:[['protein-bar', 60], ['apple', 150]], scale:[60, 60] },
  ],
  dinner: [
    { name:'Salmon, sweet potato and greens', items:[['salmon', 150], ['sweet-potato', 200], ['broccoli', 120]], scale:[110, 220] },
    { name:'Lean beef pasta', items:[['beef-mince', 140], ['pasta-cooked', 180], ['tomato-passata', 120], ['spinach', 40]], scale:[100, 220] },
    { name:'Fish, rice and vegetables', items:[['white-fish', 170], ['rice-cooked', 180], ['mixed-veg', 150]], scale:[120, 250] },
    { name:'Tofu and vegetable curry with rice', items:[['tofu', 220], ['rice-cooked', 180], ['mixed-veg', 150]], scale:[150, 320] },
  ],
};
const FUEL_FEED_TEXT = {
  breakfast:{ title:'Breakfast', why:'Starts your protein for the day.' },
  lunch:{ title:'Lunch', why:'Spreading protein over 3-4 meals, roughly 3-4 hours apart, works better than one big serve.' },
  snack:{ title:'Afternoon snack', why:'Keeps protein coming between lunch and dinner.' },
  pre:{ title:'Pre-workout', why:'An easy-to-digest meal with carbs and some protein, eaten 1-2 hours before training, fuels your session. Keep fat and fibre lower so it sits comfortably.' },
  post:{ title:'Post-workout', why:'Protein plus carbs within about 2 hours of training supports recovery. If dinner is soon after, it can be your post-workout meal.' },
  dinner:{ title:'Dinner', why:'Rounds out your protein and helps you recover overnight.' },
};
const hmToMin = s => { const m = /^(\d{1,2}):(\d{2})$/.exec(s || ''); return m ? +m[1] * 60 + +m[2] : null; };
const minToHm = m => { m = ((Math.round(m / 15) * 15) % 1440 + 1440) % 1440; return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); };
function fuelSettings(profile){ return { on:false, time:'17:30', supps:{}, ...((profile && profile.fuel) || {}) }; }
function fuelOption(slot, targetP, profile, pick){
  const pool = FUEL_OPTIONS[slot].filter(o => mealAllowed(o, profile));
  if (!pool.length) return null;
  const o = pool[((pick || 0) % pool.length + pool.length) % pool.length];
  const [mainId, baseG] = o.items[0]; const per100 = FOODS[mainId].p;
  const others = itemsMacros(o.items.slice(1)).p;
  let g = Math.round(Math.max(0, targetP - others) / per100 * 100 / 5) * 5;
  g = Math.max(o.scale[0], Math.min(o.scale[1], g || baseG));
  if (mainId === 'egg') g = Math.max(100, Math.round(g / 50) * 50);           // whole eggs
  if (mainId === 'protein-bar') g = 60;
  let items = [[mainId, g], ...o.items.slice(1)];
  let m = itemsMacros(items);
  if (m.p > targetP * 1.12 && targetP > 0){ // smaller appetite / lower target: shrink the whole meal a little
    const k = Math.max(0.6, targetP / m.p);
    items = items.map(([id, gg]) => [id, id === 'egg' ? Math.max(50, Math.round(gg * k / 50) * 50) : id === 'protein-bar' ? gg : Math.max(5, Math.round(gg * k / 5) * 5)]);
    m = itemsMacros(items);
  }
  return { name: o.name, items, p: Math.round(m.p), kcal: Math.round(m.kcal), c: Math.round(m.c), count: pool.length, index: pool.indexOf(o) };
}
function fuelPlan(S, date){
  const P = S.profile || {}; const T = nutritionTargets(P); if (!T) return null;
  const cfg = fuelSettings(P); const today = isoDate(); const kg = P.weightKg || 70;
  let training = false, w = null;
  if (date === today){ const tp = todayPlan(S); training = !!(tp && (tp.workoutId || (tp.done && tp.done.length))); w = tp && tp.workoutId ? workoutById(S, tp.workoutId) : null; }
  else { const p = projectSchedule(S, today, Math.max(1, daysBetween(today, date) + 1)).find(x => x.date === date); training = !!(p && p.workoutId); w = p && p.workoutId ? workoutById(S, p.workoutId) : null; }
  const start = hmToMin(cfg.time) ?? 1050; const dur = w ? estimateDuration(w) : 60;
  const picks = ((S.daily || {})[date] || {}).fuelPick || {};
  let slots;
  if (!training) slots = [['breakfast', 480, 0.25], ['lunch', 750, 0.25], ['snack', 960, 0.2], ['dinner', 1140, 0.3]];
  else if (start < 600) slots = [['pre', start - 45, 0.12], ['post', start + dur + 30, 0.28], ['lunch', 780, 0.25], ['snack', 990, 0.12], ['dinner', 1140, 0.23]];   // early-morning training
  else if (start < 900) slots = [['breakfast', 450, 0.22], ['pre', start - 90, 0.15], ['post', start + dur + 30, 0.25], ['snack', 1000, 0.13], ['dinner', 1140, 0.25]];
  else slots = [['breakfast', 450, 0.22], ['lunch', 750, 0.23], ['pre', start - 90, 0.13], ['post', start + dur + 30, 0.25], ['dinner', Math.max(1170, start + dur + 120), 0.17]];
  // a post-workout meal close to dinner time becomes the dinner
  const feeds = slots.map(([slot, t, share]) => {
    const target = Math.round(T.p * share / 5) * 5; const opt = fuelOption(slot, target, P, picks[slot] || 0);
    return { slot, time: minToHm(t), target, option: opt, ...FUEL_FEED_TEXT[slot] };
  }).sort((a, b) => hmToMin(a.time) - hmToMin(b.time));
  const supps = [];
  const minor = (P.age || 30) < 18;
  if (cfg.supps.protein) supps.push({ id:'protein', title:'Protein powder (optional)', when:'Only on days your meals fall short of your protein target, usually as the post-workout shake.', dose:'1 scoop (about 25-30 g of powder, roughly 20-25 g protein). Check your product\'s label.', who:'Choose a plant protein if you avoid dairy. Food first: powder is a convenience, not a requirement.', source: FUEL_SOURCES.protein });
  if (cfg.supps.creatine && !minor) supps.push({ id:'creatine', title:'Creatine monohydrate', when:'Once a day, any time that is easy to remember, with water or a meal. Training and rest days.', dose:'3-5 g a day. No loading phase needed.', who:'The most researched supplement for strength training. A small rise in body weight from water in the muscles is normal. Skip it and ask your doctor first if you have kidney problems, take regular medication, or are pregnant or breastfeeding.', source: FUEL_SOURCES.creatine });
  if (cfg.supps.caffeine && !minor && training) supps.push({ id:'caffeine', title:'Caffeine before training (optional)', when:'30-60 minutes before your workout.' + (start >= 900 ? ' Your session is in the afternoon: caffeine late in the day can disturb sleep, so consider skipping it.' : ''), dose:`Beginners: start with one regular coffee. Research doses for performance are 3-6 mg per kg, about ${Math.round(kg * 3)}-${Math.round(kg * 6)} mg for you, but more is not needed to start. Count all coffee, tea, energy drinks and pre-workout products, and stay under 400 mg a day in total.`, who:'Skip it if you are pregnant, have a heart condition or high blood pressure, get anxious or jittery with coffee, or are sensitive to caffeine.', source: FUEL_SOURCES.caffeine, source2: FUEL_SOURCES.caffeineLimit });
  return { date, training, workout: w, start: training ? minToHm(start) : null, end: training ? minToHm(start + dur) : null, T, feeds, supps, minor,
    water: training ? `Drink ${Math.round(T.water / 1000 * 10) / 10} L across the day, including a glass or two in the 1-2 hours before training and sips during your session.` : `Drink about ${Math.round(T.water / 1000 * 10) / 10} L across the day.`,
    total: feeds.reduce((a, f) => a + (f.option ? f.option.p : 0), 0) };
}
if (typeof module !== 'undefined') Object.assign(module.exports, { fuelPlan, fuelOption, fuelSettings, FUEL_OPTIONS, FUEL_SOURCES });
/* ===== 5-Day Split: Chest & Triceps · Back & Biceps · Full Leg · Isolated Shoulder · Biceps & Triceps (no DOM) =====
   Every exercise is 3 sets of 10-12 reps. Members pick which day to do each day; DrukFit suggests the next one. */
const SPLIT_DAYS = [
  { id:'split-1', n:1, name:'Chest & Triceps', color:'#ff7a1a', focus:'Chest, Triceps', ex:['bench','incline-bench','pec-deck','pushdown','oh-ext','skullcrusher'] },
  { id:'split-2', n:2, name:'Back & Biceps', color:'#3cc2b6', focus:'Back, Biceps', ex:['bb-row','cable-row','lat-pulldown','preacher-curl','hammer-curl','bb-curl-straight'] },
  { id:'split-3', n:3, name:'Full Leg', color:'#64a3ff', focus:'Quads, Hamstrings, Adductors', ex:['hack-squat','leg-ext','adductor','lying-leg-curl','leg-curl','leg-press'] },
  { id:'split-4', n:4, name:'Isolated Shoulder', color:'#f5b83d', focus:'Front, side and rear delts', ex:['rev-pec-deck','front-raise','lat-raise','db-ohp'] },
  { id:'split-5', n:5, name:'Biceps & Triceps', color:'#9d8cff', focus:'Arms', ex:['pushdown','oh-ext','skullcrusher','bb-curl-straight','hammer-curl','preacher-curl'] },
];
const SPLIT_NOTES = { 'pec-deck':'Flyes: machine, or cable fly if the machine is busy', 'db-ohp':'Military press, seated with dumbbells', 'cable-row':'Wide grip', 'lat-pulldown':'Wide grip', 'pushdown':'Rope attachment' };
function splitDay(id){ return SPLIT_DAYS.find(d => d.id === id) || null; }
function isSplitId(id){ return /^split-[1-5]$/.test(id || ''); }
function splitWorkout(id, profile){
  const d = splitDay(id); if (!d) return null;
  return { id: d.id, tpl:'split', name:`Day ${d.n} · ${d.name}`, focus: d.focus, split: true,
    exercises: d.ex.map(exId => { const ex = EXERCISES[exId]; return { exId, sets:3, repMin:10, repMax:12, rest: ex.compound ? 90 : 60, start: startingWeight(ex, profile || {}, 12) }; }) };
}
/* Which split days were done this week, and which day comes next (the one after the last split day done). */
function splitStatus(S, date){
  date = date || isoDate(); const ws = weekStart(date);
  const done = S.sessions.filter(s => s.end && isSplitId(s.workoutId));
  const week = new Set(done.filter(s => s.date >= ws && s.date <= addDays(ws, 6)).map(s => s.workoutId));
  const last = done.length ? done[done.length - 1] : null;
  const nextN = last ? (splitDay(last.workoutId).n % 5) + 1 : 1;
  const chosen = ((S.daily || {})[date] || {}).split || null;
  const doneToday = done.filter(s => s.date === date).map(s => s.workoutId);
  return { week, last, next: 'split-' + nextN, chosen: isSplitId(chosen) ? chosen : null, doneToday, today: doneToday[0] || (isSplitId(chosen) ? chosen : null) };
}
/* Turn the split into the weekly plan (old plan kept so it can be restored). */
function splitPlan(prevPlan, profile){
  const days = prevPlan && prevPlan.trainDays && prevPlan.trainDays.length === 5 ? prevPlan.trainDays.slice() : [1,2,3,4,5];
  const prev = prevPlan && prevPlan.split === 'drukfit5' ? prevPlan.prev : prevPlan;
  return { split:'drukfit5', splitLabel:'5-Day Split', workouts: SPLIT_DAYS.map(d => splitWorkout(d.id, profile)), rotation: SPLIT_DAYS.map(d => d.id), trainDays: days, pointer: 0, generatedAt: Date.now(), version: 1, prev: prev || null };
}
function splitLimitNotes(id, profile){
  const lim = new Set(profile && profile.limitations || []); const d = splitDay(id); if (!d || !lim.size) return [];
  return d.ex.filter(x => (EXERCISES[x].stress || []).some(t => lim.has(t))).map(x => EXERCISES[x]);
}
if (typeof module !== 'undefined') Object.assign(module.exports, { SPLIT_DAYS, splitWorkout, splitStatus, splitPlan, splitDay, isSplitId, splitLimitNotes });
/* ===== DrukFit Daily: goals, checklist, challenges, streaks, feed ranking (no DOM) =====
   Completion is only ever derived from what the member actually recorded, or from an explicit
   tap ("Mark as read", "I did this", manual check). Opening a page never completes anything. */

const DAILY_CATEGORIES = {
  strength:   { label:'Strength & muscle',   short:'Strength' },
  technique:  { label:'Workout technique',   short:'Technique' },
  research:   { label:'Sports science',      short:'Research' },
  nutrition:  { label:'Nutrition',           short:'Nutrition' },
  recovery:   { label:'Recovery & sleep',    short:'Recovery' },
  tech:       { label:'Fitness technology',  short:'Tech' },
  motivation: { label:'Motivation & habits', short:'Motivation' },
  beginner:   { label:'Beginner basics',     short:'Basics' },
  archery:    { label:'Archery',             short:'Archery' },
};
const DAILY_GOAL_DEFS = {
  workout:  { label:'Complete today\'s workout',        icon:'dumbbell', route:'train' },
  sets:     { label:'Log all your working sets',         icon:'check',    route:'train' },
  protein:  { label:'Reach your protein target',         icon:'food',     route:'nutrition' },
  calories: { label:'Stay within your calorie range',    icon:'flame',    route:'nutrition' },
  water:    { label:'Reach your water target',           icon:'drop',     route:'dashboard' },
  move:     { label:'Cardio, walk or mobility',          icon:'trend',    route:'train' },
  sleep:    { label:'Record last night\'s sleep',        icon:'moon',     route:'dashboard' },
  fuel:     { label:'Pre- and post-workout fuel',       icon:'food',     route:'nutrition' },
  archery:  { label:'Warm up before shooting',          icon:'target',   route:'daily' },
  tip:      { label:'Read today\'s coaching tip',        icon:'info',     route:'daily' },
  challenge:{ label:'Complete today\'s challenge',       icon:'star',     route:'daily/challenges' },
};
const NO_MANUAL = ['tip', 'challenge']; // these have their own explicit actions

function dailyHash(s){ let h = 2166136261; for (let i = 0; i < s.length; i++){ h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function dailyRecord(S, date){ return ((S.daily || {})[date]) || {}; }
function dailyCfg(S){ return S.dailycfg || {}; }

/* What did the member record on this date? */
function dayContext(S, date){
  const today = isoDate();
  const sess = sessionsOn(S, date);
  const lifting = sess.filter(s => s.workoutId !== 'mobility' && (s.exercises || []).some(e => (e.sets || []).length));
  let plannedId = null;
  if (date === today){ const tp = todayPlan(S); plannedId = tp && tp.workoutId; }
  else if (date > today){ const p = projectSchedule(S, today, daysBetween(today, date) + 1).find(x => x.date === date); plannedId = p && p.workoutId; }
  const chosenSplit = typeof isSplitId === 'function' && isSplitId(((S.daily || {})[date] || {}).split) ? S.daily[date].split : null;
  const training = !!plannedId || !!chosenSplit || lifting.length > 0 || (date < today && isTrainingDay(S, date));
  let planned = plannedId ? workoutById(S, plannedId) : (lifting[0] && workoutById(S, lifting[0].workoutId));
  if (chosenSplit && !lifting.length) planned = workoutById(S, chosenSplit) || splitWorkout(chosenSplit, S.profile);
  if (!planned && lifting[0] && typeof isSplitId === 'function' && isSplitId(lifting[0].workoutId)) planned = splitWorkout(lifting[0].workoutId, S.profile);
  const P = S.profile || {}; const T = S.profile ? nutritionTargets(P) : null;
  const fd = (S.food || {})[date] || {}; const ft = foodDayTotals(fd); const entries = (fd.entries || []).length;
  const hab = (S.habits || {})[date] || {};
  const allSets = lifting.length > 0 && lifting.every(s => s.exercises.length && s.exercises.every(e => (e.sets || []).length >= ((e.plan && e.plan.sets) || 1)));
  const setsLogged = sum(lifting.map(s => s.exercises.reduce((n, e) => n + (e.sets || []).length, 0)));
  const setsPlanned = sum(lifting.map(s => s.exercises.reduce((n, e) => n + ((e.plan && e.plan.sets) || (e.sets || []).length), 0)));
  const mobilityDone = sess.some(s => s.workoutId === 'mobility');
  const moved = mobilityDone || sess.some(s => s.cardio && s.cardio.done) || (hab.steps || 0) >= 6000;
  const rep = (S.reportsDoc && S.reportsDoc.saved) || {};
  const reviewed = Object.values(rep).some(r => r && r.savedAt && isoDate(new Date(r.savedAt)) === date);
  const rec0 = dailyRecord(S, date);
  return { shooting: typeof shootingDay === 'function' && shootingDay(S.profile, date), archeryWarm: !!rec0.archeryWarmup, date, today, training, planned, plannedCardio: !!(planned && planned.cardio), lifting, workoutDone: lifting.length > 0, allSets, setsLogged, setsPlanned,
    T, ft, entries, water: fd.water || 0, hab, moved, mobilityDone, reviewed, goal: P.goal, limitations: P.limitations || [] };
}

/* ---------- Challenges ---------- */
const DAILY_CHALLENGES = [
  { id:'plan-workout', when:'train', mins:'45-75', title:'Complete your planned workout', purpose:'Consistency with the plan drives progress more than any single hard session.',
    steps:['Start today\'s workout from the Train tab','Warm up, then work through each exercise','Tap Finish to save it'], criteria:'Completes automatically when you finish and save today\'s scheduled workout.', auto: c => c.workoutDone },
  { id:'all-sets', when:'train', mins:'during your workout', title:'Record every working set', purpose:'Accurate logs are what make next session\'s weight suggestions reliable.',
    steps:['Enter weight and reps for each set','Tick each set as you finish it','Finish and save the workout'], criteria:'Completes automatically when every planned set in today\'s saved workout is ticked.', auto: c => c.allSets },
  { id:'learn-technique', when:'any', mins:'5', title:'Learn one exercise technique', purpose:'Good technique keeps the right muscles working and lowers injury risk.', self:true,
    steps:['Open an exercise from today\'s plan or the Exercises library','Read the technique cues and watch a demonstration','Practise a few slow reps with little or no load'], criteria:'Tap "I did this" once you have reviewed the cues. This is self-reported.' },
  { id:'balanced-meal', when:'any', mins:'20-30', title:'Prepare a balanced meal', purpose:'A plate with vegetables, a protein food and a whole-grain or starchy carb makes daily targets easier to reach.', self:true,
    steps:['Fill about half the plate with vegetables or fruit','Add a palm-sized protein food','Add a portion of whole grains or starchy carbs','Log it in your food diary'], criteria:'Tap "I did this" after preparing it. This is self-reported.', source:{ name:'USDA MyPlate', url:'https://www.myplate.gov/' } },
  { id:'recovery-walk', when:'rest', mins:'20', title:'Take a 20-minute recovery walk', purpose:'Easy movement on rest days supports recovery without adding training stress.',
    steps:['Walk at a pace where you can still talk','Aim for about 20 minutes','Log today\'s steps on the dashboard'], criteria:'Completes automatically when you log 6,000+ steps, or tap "I did this".', auto: c => (c.hab.steps || 0) >= 6000, self:true },
  { id:'mobility', when:'rest', mins:'10-15', title:'Do a short mobility routine', purpose:'Regular mobility work helps you reach good positions in your lifts.',
    steps:['Start "Mobility & Recovery" from the Train tab','Move slowly and stay in a pain-free range','Finish to save it'], criteria:'Completes automatically when you finish the mobility session.', auto: c => c.mobilityDone, gentle:['knee','hip','back'] },
  { id:'hydrate', when:'any', mins:'all day', title:'Reach your water target', purpose:'Steady hydration through the day supports training and recovery.', needsTargets:true,
    steps:['Keep a water bottle nearby','Log water as you drink','Spread it through the day rather than all at once'], criteria:'Completes automatically when your logged water reaches your daily target.', auto: c => c.T && c.water >= c.T.water },
  { id:'protein', when:'any', mins:'all day', title:'Hit your protein target', purpose:'Enough daily protein supports muscle repair and growth from your training.', needsTargets:true,
    steps:['Include a protein food at each meal','Log meals as you eat them','Check the Nutrition tab in the afternoon and close any gap'], criteria:'Completes automatically when logged protein reaches 90% of your target.', auto: c => c.T && c.ft.p >= c.T.p * 0.9 },
  { id:'sleep-log', when:'any', mins:'1', title:'Log last night\'s sleep', purpose:'Sleep is one of the biggest drivers of recovery, and tracking it shows patterns.',
    steps:['Open "More for today" on the dashboard','Enter how many hours you slept'], criteria:'Completes automatically when you record last night\'s sleep.', auto: c => c.hab.sleep != null },
  { id:'review-week', when:'any', mins:'5', title:'Review your weekly progress', purpose:'A quick weekly review shows what is working and what to adjust.',
    steps:['Open Weekly Reports','Generate this week\'s report and read the coach review','Tap Save report'], criteria:'Completes automatically when you save a weekly report today.', auto: c => c.reviewed },
  { id:'archery-warmup', when:'any', archery:true, mins:'10', title:'Warm up before you shoot', purpose:'A short shoulder and upper-back warm-up helps you draw smoothly and evenly from the first end.',
    steps:['Open DrukFit Daily and tap "Start archery warm-up"','Work through the moves, the same reps on both sides','Shoot two or three easy ends before full draws'], criteria:'Completes automatically when you finish the archery warm-up.', auto: c => c.archeryWarm },
];
const WEEKLY_CHALLENGES = [
  { id:'all-sessions', title:'Complete every planned session this week', purpose:'Showing up for the whole plan is the foundation of progress.', check: (S, ws) => { const w = weekStats(S, ws); return { done: w.done >= w.target && w.target > 0, progress: Math.min(w.done, w.target), target: w.target }; } },
  { id:'food-4', title:'Log your food on 4 days this week', purpose:'A few days of logs make nutrition advice accurate.', check: (S, ws) => { let n = 0; for (let i = 0; i < 7; i++){ const fd = (S.food || {})[addDays(ws, i)]; if (fd && (fd.entries || []).length) n++; } return { done: n >= 4, progress: Math.min(n, 4), target: 4 }; } },
  { id:'sleep-5', title:'Log your sleep on 5 nights this week', purpose:'Five nights of data is enough to spot a sleep pattern.', check: (S, ws) => { let n = 0; for (let i = 0; i < 7; i++){ const h = (S.habits || {})[addDays(ws, i)]; if (h && h.sleep != null) n++; } return { done: n >= 5, progress: Math.min(n, 5), target: 5 }; } },
];
function eligibleChallenges(S, c){
  return DAILY_CHALLENGES.filter(ch => (!ch.archery || c.shooting) && (ch.when === 'any' || (ch.when === 'train') === c.training) && (!ch.needsTargets || c.T));
}
function dailyChallenge(S, date, uidSeed){
  const c = dayContext(S, date); const rec = dailyRecord(S, date);
  let ch = rec.ch && DAILY_CHALLENGES.find(x => x.id === rec.ch.id);
  if (!ch){ const pool = eligibleChallenges(S, c); ch = pool[dailyHash(date + ':' + (uidSeed || '')) % pool.length]; }
  const autoDone = !!(ch.auto && ch.auto(c));
  const selfDone = !!(rec.ch && rec.ch.id === ch.id && rec.ch.self);
  const gentle = ch.gentle && ch.gentle.some(l => c.limitations.includes(l));
  return { ...ch, done: autoDone || selfDone, how: autoDone ? 'auto' : selfDone ? 'self' : null, gentleNote: gentle ? 'You have marked an area to protect. Skip any position that is uncomfortable and keep every movement pain-free.' : null };
}
function weeklyChallenge(S, ws){ const n = WEEKLY_CHALLENGES.length; const k = ((Math.floor(daysBetween('2026-01-05', ws) / 7) % n) + n) % n; const w = WEEKLY_CHALLENGES[k]; return { ...w, ...w.check(S, ws), ws }; }

/* ---------- Daily goals ---------- */
function dailyGoals(S, date, uidSeed){
  const c = dayContext(S, date); const rec = dailyRecord(S, date); const manual = rec.manual || {}; const disabled = dailyCfg(S).disabled || {};
  const g = [];
  const add = (id, applicable, autoDone, detail, notApplicableWhy) => { if (!applicable || disabled[id]) return; const m = !!manual[id] && !NO_MANUAL.includes(id); g.push({ id, ...DAILY_GOAL_DEFS[id], detail, done: !!autoDone || m, how: autoDone ? 'auto' : m ? 'manual' : null }); };
  add('workout', c.training, c.workoutDone, c.workoutDone ? 'Saved' : c.planned ? c.planned.name : 'Scheduled');
  add('sets', c.training, c.allSets, c.setsPlanned ? `${c.setsLogged} of ${c.setsPlanned} planned sets` : 'Tick each set as you go');
  add('protein', !!c.T, c.T && c.ft.p >= c.T.p * 0.9, c.T ? `${Math.round(c.ft.p)} / ${c.T.p} g` : '');
  add('calories', !!c.T && ['fat_loss','recomp','muscle_gain'].includes(c.goal), c.T && c.entries >= 2 && Math.abs(c.ft.kcal - c.T.kcal) <= c.T.kcal * 0.1, c.T ? `${Math.round(c.ft.kcal)} of ${c.T.kcal} kcal (±10%)` : '');
  add('water', !!c.T, c.T && c.water >= c.T.water, c.T ? `${c.water} / ${c.T.water} ml` : '');
  add('move', c.plannedCardio || !c.training, c.moved, c.training ? 'Optional cardio finisher' : 'Rest day: 20-min walk or mobility');
  add('sleep', true, c.hab.sleep != null, c.hab.sleep != null ? `${c.hab.sleep} h recorded` : 'Not recorded yet');
  const fz = rec.fuel || {}; add('fuel', c.training && typeof fuelSettings === 'function' && fuelSettings(S.profile).on, fz.pre && fz.post, fz.pre && fz.post ? 'Both done' : fz.pre ? 'Pre-workout done, post-workout next' : 'From your fuel plan');
  add('archery', c.shooting, c.archeryWarm, c.archeryWarm ? 'Warm-up done' : 'Shooting day: 10-minute shoulder warm-up');
  add('tip', true, !!rec.tipRead, rec.tipRead ? 'Read' : 'One minute');
  const ch = dailyChallenge(S, date, uidSeed); add('challenge', true, ch.done, ch.title);
  const done = g.filter(x => x.done).length;
  return { date, training: c.training, goals: g, done, total: g.length, pct: g.length ? Math.round(done / g.length * 100) : 0, challenge: ch, ctx: c };
}
function goalSuggestion(id, c){
  const T = c.T;
  return ({
    workout: c.date === c.today ? 'If today got away from you, that\'s fine: the session moves to your next training day automatically. No need to double up.' : 'Missed sessions roll forward, so just pick up the next one.',
    sets: 'Next time, tick each set as you finish it. Even rough numbers make tomorrow\'s weight suggestions better.',
    protein: T ? `You're about ${Math.max(0, Math.round(T.p - c.ft.p))} g short. A Greek yoghurt (~20 g), a whey shake (~23 g) or 150 g chicken (~46 g) would close most of it.` : '',
    calories: 'Close is good enough. Aim for most days near target rather than a perfect day.',
    water: 'Keep a bottle in sight and log a glass with each meal.',
    move: 'Even a 10-minute walk after a meal counts as movement.',
    sleep: 'Log it in "More for today" on the dashboard. It takes ten seconds.',
    tip: 'Today\'s tip takes about a minute to read.',
    challenge: 'Challenges are optional. Pick it up tomorrow if today is busy.',
  })[id] || '';
}

/* ---------- History, streaks, points, badges (all derived from records) ---------- */
function dailyHistory(S, uidSeed, days){
  const out = []; const today = isoDate(); const start = S.profile && S.profile.createdAt ? S.profile.createdAt : addDays(today, -(days || 60));
  for (let i = 0; i < (days || 60); i++){ const d = addDays(today, -i); if (d < start) break; out.push(dailyGoals(S, d, uidSeed)); }
  return out; // newest first
}
function dailyStats(S, uidSeed){
  const h = dailyHistory(S, uidSeed, 120);
  let streak = 0; for (let i = 0; i < h.length; i++){ if (h[i].challenge.done) streak++; else if (i === 0) continue; else break; }
  let best = 0, run = 0; [...h].reverse().forEach(x => { if (x.challenge.done){ run++; best = Math.max(best, run); } else run = 0; });
  const tipsRead = h.filter(x => x.goals.some(g => g.id === 'tip' && g.done)).length;
  const challenges = h.filter(x => x.challenge.done).length;
  const points = sum(h.map(x => (x.challenge.done ? 10 : 0) + x.goals.filter(g => g.done && g.id !== 'challenge').length * 2));
  const fullDays = h.filter(x => x.total > 0 && x.done === x.total).length;
  const weeklyDone = (() => { let n = 0; for (let k = 1; k <= 8; k++){ const ws = addDays(weekStart(isoDate()), -7 * k); if (S.profile && S.profile.createdAt && addDays(ws, 6) < S.profile.createdAt) break; if (weeklyChallenge(S, ws).done) n++; } return n + (weeklyChallenge(S, weekStart(isoDate())).done ? 1 : 0); })();
  const badges = [
    { id:'first', label:'First challenge', earned: challenges >= 1, icon:'star' },
    { id:'streak3', label:'3-day streak', earned: best >= 3, icon:'flame' },
    { id:'streak7', label:'7-day streak', earned: best >= 7, icon:'flame' },
    { id:'streak14', label:'14-day streak', earned: best >= 14, icon:'trophy' },
    { id:'learner', label:'Curious mind · 5 tips read', earned: tipsRead >= 5, icon:'info' },
    { id:'fullday', label:'Full house · every goal in a day', earned: fullDays >= 1, icon:'check' },
    { id:'weekly', label:'Weekly challenge complete', earned: weeklyDone >= 1, icon:'cal' },
  ];
  return { streak, best, points, tipsRead, challenges, fullDays, badges, history: h };
}

/* ---------- Coaching tips (educational tips cite checked sources) ---------- */
const DAILY_TIPS = [
  { id:'t-cdc', cat:'beginner', text:'Adults are advised to get about 150 minutes of moderate activity a week plus muscle-strengthening on at least 2 days. Your lifting days count toward the second part.', source:{ name:'CDC: Adult Activity: An Overview', url:'https://www.cdc.gov/physical-activity-basics/guidelines/adults.html' } },
  { id:'t-sleep', cat:'recovery', text:'Experts recommend 7 to 9 hours of sleep a night for adults. Consistent bed and wake times make that easier to hit.', source:{ name:'NHLBI, NIH: How Much Sleep Is Enough?', url:'https://www.nhlbi.nih.gov/health/sleep/how-much-sleep' } },
  { id:'t-protein', cat:'nutrition', goals:['muscle_gain','recomp','strength','fat_loss'], text:'In a large 2018 meta-analysis, extra protein added to resistance training gains, but the benefit levelled off at around 1.6 g per kg of body weight a day for most people.', source:{ name:'Morton et al., Br J Sports Med 2018', url:'https://doi.org/10.1136/bjsports-2017-097608' } },
  { id:'t-volume', cat:'strength', goals:['muscle_gain','recomp','strength'], text:'A 2017 meta-analysis found a dose-response pattern: more weekly sets per muscle tended to bring more muscle growth. Add sets gradually rather than all at once.', source:{ name:'Schoenfeld, Ogborn & Krieger, J Sports Sci 2017', url:'https://doi.org/10.1080/02640414.2016.1210197' } },
  { id:'t-rir', cat:'technique', text:'Leaving one to three reps "in the tank" on most sets lets you train hard while keeping technique clean. Your RPE log tracks this.' },
  { id:'t-warmup', cat:'technique', text:'Ramp-up sets on your first lift (light, then about half, then about three-quarters of your working weight) prepare you without tiring you out.' },
  { id:'t-overload', cat:'strength', text:'Progress doesn\'t have to mean more weight. One more rep at the same weight is progress too, and it\'s how DrukFit decides when to add load.' },
  { id:'t-walk', cat:'recovery', text:'Easy walking on rest days adds activity without the fatigue of another hard session.' },
  { id:'t-plate', cat:'nutrition', text:'A simple plate check: half vegetables or fruit, a quarter protein, a quarter grains or starchy carbs.', source:{ name:'USDA MyPlate', url:'https://www.myplate.gov/' } },
  { id:'t-habit', cat:'motivation', text:'Missed a day? Don\'t try to make it up. Just do the next planned session. Consistency over weeks beats any single workout.' },
  { id:'t-who', cat:'beginner', text:'The WHO notes that muscle strengthening benefits everyone, at any age. Starting light and building up is how every strong lifter began.', source:{ name:'WHO: Physical activity fact sheet', url:'https://www.who.int/news-room/fact-sheets/detail/physical-activity' } },
  { id:'t-pain', cat:'technique', text:'Muscle effort and joint pain are different. Burning in the muscle is normal; sharp or joint pain means stop and swap the exercise.' },
];
function dailyTip(S, date, uidSeed){
  const goal = (S.profile || {}).goal; const pool = DAILY_TIPS.filter(t => !t.goals || t.goals.includes(goal));
  const t = pool[dailyHash('tip:' + date + ':' + (uidSeed || '')) % pool.length];
  let personal = null;
  try { const wr = weeklyReport(S, date); personal = wr.recs && wr.recs[0]; } catch(e){}
  return { ...t, personal };
}

/* ---------- Feed ranking ---------- */
const GOAL_TOPICS = {
  muscle_gain: { strength:2, nutrition:1.5, recovery:1, technique:1 }, fat_loss: { nutrition:2, motivation:1.5, beginner:0.5, recovery:0.5 },
  strength: { strength:2, technique:1.5, research:1 }, recomp: { strength:1.5, nutrition:1.5, recovery:0.5 },
  endurance: { research:1, recovery:1, tech:1 }, general: { beginner:1, motivation:1, recovery:1 },
};
const GOAL_WORDS = { muscle_gain:'building muscle', fat_loss:'losing fat', strength:'getting stronger', recomp:'recomposition', endurance:'endurance', general:'general fitness' };
function rankFeed(items, profile, prefs, now){
  profile = profile || {}; prefs = prefs || {}; now = now || isoDate();
  const gw = GOAL_TOPICS[profile.goal] || {};
  const archer = typeof archeryOn === 'function' && archeryOn(profile);
  return items.filter(a => prefs[a.category] !== 'hide' && !a.hidden && (a.category !== 'archery' || archer || prefs.archery === 'more')).map(a => {
    let score = 1, reason = null, best = 0;
    const g = gw[a.category] || 0; if (g){ score += g; if (g > best){ best = g; reason = `Because you're focusing on ${GOAL_WORDS[profile.goal]}`; } }
    if (profile.experience === 'beginner' && (a.category === 'beginner' || a.category === 'technique')){ score += 2; if (2 > best){ best = 2; reason = 'Good for building your foundations'; } }
    if (profile.experience === 'advanced' && (a.category === 'research' || a.kind === 'research')){ score += 1.5; if (1.5 > best){ best = 1.5; reason = 'Recent research for experienced lifters'; } }
    if (archer && a.category === 'archery'){ score += 3; if (3 > best){ best = 3; reason = 'For your archery'; } }
    if (prefs[a.category] === 'more'){ score += 2.5; if (2.5 > best){ best = 2.5; reason = 'A topic you follow'; } }
    const age = a.published ? daysBetween(a.published.slice(0, 10), now) : 9999;
    if (a.kind === 'research' || a.kind === 'news'){ const fresh = Math.max(0, 1.5 - age / 40); score += fresh; if (age <= 14 && fresh > best){ best = fresh; reason = 'New in the last two weeks'; } }
    else score += 0.4;
    if (a.reviewed) score += 0.3;
    return { ...a, score: Math.round(score * 100) / 100, reason };
  }).sort((x, y) => y.score - x.score || (y.published || '').localeCompare(x.published || ''));
}
function articleBadge(a, now){
  now = now || isoDate();
  if (a.kind === 'research'){ const age = a.published ? daysBetween(a.published.slice(0, 10), now) : 9999; return age <= 90 ? 'New research' : 'Research'; }
  return { guidance:'Established guidance', news:'Health news', editorial:'Editorial', motivation:'Motivation' }[a.kind] || 'Article';
}
if (typeof module !== 'undefined') Object.assign(module.exports, { dailyGoals, dailyChallenge, weeklyChallenge, dailyStats, dailyTip, rankFeed, articleBadge, dayContext, DAILY_CHALLENGES, DAILY_TIPS, goalSuggestion, eligibleChallenges });
