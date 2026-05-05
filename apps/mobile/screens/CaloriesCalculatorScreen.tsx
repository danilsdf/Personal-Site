import React, { useState } from 'react';
import {
  FlatList,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const GOLD = '#d2a852';

// ─── Types ────────────────────────────────────────────────────────────────────

type Units = 'metric' | 'imperial';
type Sex = 'male' | 'female';
type Goal = 'lose' | 'maintain' | 'gain';

type ActivityOption = {
  value: string;
  short: string;
  label: string;
  factor: number;
};

type FormulaOption = {
  value: string;
  label: string;
  description: string;
  formula: (
    sex: string,
    weight: number,
    height: number,
    age: number,
    lbm: number,
    fat: number,
  ) => number;
  needsLBM?: boolean;
  needsFat?: boolean;
};

type RangedResults = { mild: number; normal: number; extreme: number };

type ValidationParams = {
  units: Units;
  age: string;
  heightFt: string;
  heightIn: string;
  heightCm: string;
  weightLbs: string;
  weightKg: string;
  bodyFat: string;
  lbm: string;
  needsFat: boolean;
  needsLBM: boolean;
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const activityOptions: ActivityOption[] = [
  { value: 'basal', short: 'BMR', label: 'Basal Metabolic Rate (BMR)', factor: 1 },
  { value: 'sedentary', short: 'Sedentary', label: 'Sedentary: little or no exercise', factor: 1.2 },
  { value: 'light', short: 'Light', label: 'Light: exercise 1–3 times/week', factor: 1.375 },
  { value: 'moderate', short: 'Moderate', label: 'Moderate: exercise 4–5 times/week', factor: 1.55 },
  { value: 'active', short: 'Active', label: 'Active: daily or intense 3–4×/week', factor: 1.725 },
  { value: 'very', short: 'Very Active', label: 'Very Active: intense 6–7×/week', factor: 1.9 },
  { value: 'extra', short: 'Extra Active', label: 'Extra Active: very intense daily or physical job', factor: 2 },
];

const formulaOptions: FormulaOption[] = [
  {
    value: 'mifflin',
    label: 'Mifflin–St Jeor',
    description: 'Modern standard. Good population average.',
    formula: (sex, weight, height, age) =>
      sex === 'male'
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161,
  },
  {
    value: 'harris',
    label: 'Harris–Benedict',
    description: 'Legacy formula. Slightly higher for muscular people.',
    formula: (sex, weight, height, age) =>
      sex === 'male'
        ? 88.36 + 13.4 * weight + 4.8 * height - 5.7 * age
        : 447.6 + 9.2 * weight + 3.1 * height - 4.3 * age,
  },
  {
    value: 'katch',
    label: 'Katch–McArdle',
    description: 'LBM-based. Best when you know your body fat %.',
    formula: (_sex, _w, _h, _a, lbm) => 370 + 21.6 * lbm,
    needsLBM: true,
  },
  {
    value: 'cunningham',
    label: 'Cunningham',
    description: 'Athlete-biased. Assumes trained muscle.',
    formula: (_sex, _w, _h, _a, lbm) => 500 + 22 * lbm,
    needsLBM: true,
  },
  {
    value: 'nelson',
    label: 'Nelson / Fat-Mass–Adjusted',
    description: 'Splits metabolism into fat and lean mass. Requires body composition.',
    formula: (_sex, _w, _h, _a, lbm, fat) => 25.8 * lbm + 4.04 * fat + 19.6,
    needsLBM: true,
    needsFat: true,
  },
];

// ─── Pure helpers ─────────────────────────────────────────────────────────────

function validateImperial(p: ValidationParams, errs: Record<string, string>) {
  const ft = Number(p.heightFt);
  const ins = Number(p.heightIn);
  const lbs = Number(p.weightLbs);
  if (!p.heightFt || ft < 3 || ft > 8) errs.heightFt = 'Height (ft) should be 3–8';
  if (p.heightIn === '' || ins < 0 || ins > 11) errs.heightIn = 'Height (in) should be 0–11';
  if (!p.weightLbs || lbs < 50 || lbs > 700) errs.weightLbs = 'Weight (lbs) should be 50–700';
}

function validateMetric(p: ValidationParams, errs: Record<string, string>) {
  const cm = Number(p.heightCm);
  const kg = Number(p.weightKg);
  if (!p.heightCm || cm < 90 || cm > 250) errs.heightCm = 'Height (cm) should be 90–250';
  if (!p.weightKg || kg < 20 || kg > 320) errs.weightKg = 'Weight (kg) should be 20–320';
}

function validateLBM(p: ValidationParams, errs: Record<string, string>) {
  const lbmNum = Number(p.lbm);
  if (!p.lbm || Number.isNaN(lbmNum) || lbmNum <= 0) {
    errs.lbm = 'Enter your lean body mass';
  } else if (p.units === 'imperial' && (lbmNum < 30 || lbmNum > 600)) {
    errs.lbm = 'LBM (lbs) should be 30–600';
  } else if (p.units === 'metric' && (lbmNum < 15 || lbmNum > 270)) {
    errs.lbm = 'LBM (kg) should be 15–270';
  }
}

function validate(p: ValidationParams): Record<string, string> {
  const errs: Record<string, string> = {};
  const ageNum = Number(p.age);
  if (!p.age || ageNum < 10 || ageNum > 120) errs.age = 'Enter a valid age (10–120)';

  if (p.units === 'imperial') validateImperial(p, errs);
  else validateMetric(p, errs);

  if (p.needsFat) {
    const bf = Number(p.bodyFat);
    if (!p.bodyFat || Number.isNaN(bf) || bf < 2 || bf > 70) {
      errs.bodyFat = 'Body fat % should be 2–70';
    }
  }
  if (p.needsLBM) validateLBM(p, errs);

  return errs;
}

function getResultTitle(g: Goal): string {
  if (g === 'lose') return 'Estimated Calories for Weight Loss';
  if (g === 'gain') return 'Estimated Calories for Weight Gain';
  return 'Estimated Daily Calories';
}

// ─── Sub-components ───────────────────────────────────────────────────────────

type PickerItem = { value: string; label: string; sublabel?: string };

function PickerModal<T extends PickerItem>({
  visible,
  items,
  onSelect,
  onClose,
  selected,
}: Readonly<{
  visible: boolean;
  items: T[];
  onSelect: (item: T) => void;
  onClose: () => void;
  selected: string;
}>) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose} />
      <View style={styles.modalSheet}>
        <View style={styles.modalHandle} />
        <FlatList
          data={items}
          keyExtractor={item => item.value}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.modalItem, item.value === selected && styles.modalItemSelected]}
              onPress={() => { onSelect(item); onClose(); }}
            >
              <Text style={[styles.modalItemLabel, item.value === selected && styles.modalItemLabelSelected]}>
                {item.label}
              </Text>
              {item.sublabel ? (
                <Text style={styles.modalItemSublabel}>{item.sublabel}</Text>
              ) : null}
            </TouchableOpacity>
          )}
        />
      </View>
    </Modal>
  );
}

type BreakdownRowData = { label: string; value: number; pct: string; rate: string };

function BreakdownList({ rows }: Readonly<{ rows: BreakdownRowData[] }>) {
  return (
    <View style={styles.breakdownList}>
      {rows.map(row => (
        <View key={row.label} style={styles.breakdownRow}>
          <Text style={styles.breakdownLabel}>{row.label}</Text>
          <Text style={styles.breakdownValue}>
            {row.value} kcal <Text style={styles.breakdownPct}>{row.pct}</Text>
          </Text>
          <Text style={styles.breakdownRate}>{row.rate}</Text>
        </View>
      ))}
    </View>
  );
}

function ResultCard({
  result,
  lastGoal,
  lossResults,
  gainResults,
}: Readonly<{
  result: number;
  lastGoal: Goal;
  lossResults: RangedResults | null;
  gainResults: RangedResults | null;
}>) {
  const lossRows: BreakdownRowData[] = lossResults
    ? [
        { label: 'Mild weight loss', value: lossResults.mild, pct: '88%', rate: '~0.5 lb/week' },
        { label: 'Weight loss', value: lossResults.normal, pct: '76%', rate: '~1 lb/week' },
        { label: 'Extreme weight loss', value: lossResults.extreme, pct: '52%', rate: '~2 lb/week' },
      ]
    : [];

  const gainRows: BreakdownRowData[] = gainResults
    ? [
        { label: 'Mild weight gain', value: gainResults.mild, pct: '112%', rate: '~0.5 lb/week' },
        { label: 'Weight gain', value: gainResults.normal, pct: '124%', rate: '~1 lb/week' },
        { label: 'Extreme weight gain', value: gainResults.extreme, pct: '148%', rate: '~2 lb/week' },
      ]
    : [];

  return (
    <View style={styles.resultCard}>
      <Text style={styles.resultTitle}>{getResultTitle(lastGoal)}</Text>
      <Text style={styles.resultValue}>{result} kcal</Text>
      <Text style={styles.resultSubtext}>Estimated daily calories based on your answers.</Text>

      {lastGoal === 'lose' && lossRows.length > 0 && <BreakdownList rows={lossRows} />}
      {lastGoal === 'gain' && gainRows.length > 0 && <BreakdownList rows={gainRows} />}

      <TouchableOpacity
        style={styles.mealPrepButton}
        onPress={() =>
          Linking.openURL(`https://www.google.com/search?q=meal+prep+recipes+${result}+calories`)
        }
      >
        <Text style={styles.mealPrepButtonText}>Search {result} kcal Meal Prep</Text>
      </TouchableOpacity>
    </View>
  );
}

function HeightInputs({
  units, heightFt, heightIn, heightCm, errors, setHeightFt, setHeightIn, setHeightCm,
}: Readonly<{
  units: Units;
  heightFt: string; heightIn: string; heightCm: string;
  errors: Record<string, string>;
  setHeightFt: (v: string) => void;
  setHeightIn: (v: string) => void;
  setHeightCm: (v: string) => void;
}>) {
  if (units === 'imperial') {
    return (
      <View style={styles.row}>
        <View style={styles.flex1}>
          <Text style={styles.label}>Height (ft)</Text>
          <TextInput
            style={[styles.input, errors.heightFt && styles.inputError]}
            keyboardType="numeric" value={heightFt} onChangeText={setHeightFt}
            placeholder="5" placeholderTextColor="#888"
          />
          {errors.heightFt ? <Text style={styles.errorText}>{errors.heightFt}</Text> : null}
        </View>
        <View style={[styles.flex1, styles.marginLeft]}>
          <Text style={styles.label}>Height (in)</Text>
          <TextInput
            style={[styles.input, errors.heightIn && styles.inputError]}
            keyboardType="numeric" value={heightIn} onChangeText={setHeightIn}
            placeholder="8" placeholderTextColor="#888"
          />
          {errors.heightIn ? <Text style={styles.errorText}>{errors.heightIn}</Text> : null}
        </View>
      </View>
    );
  }
  return (
    <>
      <Text style={styles.label}>Height (cm)</Text>
      <TextInput
        style={[styles.input, errors.heightCm && styles.inputError]}
        keyboardType="numeric" value={heightCm} onChangeText={setHeightCm}
        placeholder="180" placeholderTextColor="#888"
      />
      {errors.heightCm ? <Text style={styles.errorText}>{errors.heightCm}</Text> : null}
    </>
  );
}

function WeightInput({
  units, weightLbs, weightKg, errors, setWeightLbs, setWeightKg,
}: Readonly<{
  units: Units;
  weightLbs: string; weightKg: string;
  errors: Record<string, string>;
  setWeightLbs: (v: string) => void;
  setWeightKg: (v: string) => void;
}>) {
  if (units === 'imperial') {
    return (
      <>
        <Text style={styles.label}>Weight (lbs)</Text>
        <TextInput
          style={[styles.input, errors.weightLbs && styles.inputError]}
          keyboardType="numeric" value={weightLbs} onChangeText={setWeightLbs}
          placeholder="170" placeholderTextColor="#888"
        />
        {errors.weightLbs ? <Text style={styles.errorText}>{errors.weightLbs}</Text> : null}
      </>
    );
  }
  return (
    <>
      <Text style={styles.label}>Weight (kg)</Text>
      <TextInput
        style={[styles.input, errors.weightKg && styles.inputError]}
        keyboardType="numeric" value={weightKg} onChangeText={setWeightKg}
        placeholder="75" placeholderTextColor="#888"
      />
      {errors.weightKg ? <Text style={styles.errorText}>{errors.weightKg}</Text> : null}
    </>
  );
}

type GoalSetters = {
  setResult: (v: number) => void;
  setLossResults: (v: RangedResults | null) => void;
  setGainResults: (v: RangedResults | null) => void;
};

function applyGoal(g: Goal, calories: number, s: GoalSetters) {
  if (g === 'lose') {
    s.setResult(Math.round(calories * 0.88));
    s.setLossResults({
      mild: Math.round(calories * 0.88),
      normal: Math.round(calories * 0.76),
      extreme: Math.round(calories * 0.52),
    });
    s.setGainResults(null);
  } else if (g === 'gain') {
    s.setResult(Math.round(calories * 1.12));
    s.setGainResults({
      mild: Math.round(calories * 1.12),
      normal: Math.round(calories * 1.24),
      extreme: Math.round(calories * 1.48),
    });
    s.setLossResults(null);
  } else {
    s.setResult(Math.round(calories));
    s.setLossResults(null);
    s.setGainResults(null);
  }
}

function BodyFatInput({ bodyFat, error, onChange }: Readonly<{
  bodyFat: string;
  error?: string;
  onChange: (v: string) => void;
}>) {
  return (
    <>
      <Text style={styles.label}>Body Fat (%)</Text>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        keyboardType="numeric" value={bodyFat} onChangeText={onChange}
        placeholder="e.g. 15" placeholderTextColor="#888"
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </>
  );
}

function LBMInput({ units, lbm, error, autoLbm, onChange }: Readonly<{
  units: Units;
  lbm: string;
  error?: string;
  autoLbm: string | null;
  onChange: (v: string) => void;
}>) {
  return (
    <>
      <Text style={styles.label}>
        Lean Body Mass ({units === 'imperial' ? 'lbs' : 'kg'})
      </Text>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        keyboardType="numeric" value={lbm} onChangeText={onChange}
        placeholder={units === 'imperial' ? 'e.g. 150' : 'e.g. 68'}
        placeholderTextColor="#888"
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {autoLbm ? (
        <Text style={styles.hint}>Auto-calc from weight + body fat: {autoLbm}</Text>
      ) : null}
    </>
  );
}

export default function CaloriesCalculatorScreen() {
  const [units, setUnits] = useState<Units>('metric');
  const [age, setAge] = useState('25');
  const [heightFt, setHeightFt] = useState('5');
  const [heightIn, setHeightIn] = useState('8');
  const [heightCm, setHeightCm] = useState('180');
  const [weightLbs, setWeightLbs] = useState('170');
  const [weightKg, setWeightKg] = useState('75');
  const [sex, setSex] = useState<Sex>('male');
  const [activity, setActivity] = useState(activityOptions[2]);
  const [formula, setFormula] = useState(formulaOptions[0]);
  const [bodyFat, setBodyFat] = useState('');
  const [lbm, setLbm] = useState('');
  const [goal, setGoal] = useState<Goal>('maintain');

  const [result, setResult] = useState<number | null>(null);
  const [lastGoal, setLastGoal] = useState<Goal>('maintain');
  const [lossResults, setLossResults] = useState<RangedResults | null>(null);
  const [gainResults, setGainResults] = useState<RangedResults | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [showActivityPicker, setShowActivityPicker] = useState(false);
  const [showFormulaPicker, setShowFormulaPicker] = useState(false);

  const applyGoalSetters = { setResult, setLossResults, setGainResults };

  const handleCalculate = () => {
    const errs = validate({
      units, age, heightFt, heightIn, heightCm, weightLbs, weightKg,
      bodyFat, lbm, needsFat: !!formula.needsFat, needsLBM: !!formula.needsLBM,
    });
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const weightKgNum = units === 'imperial' ? Number(weightLbs) * 0.453592 : Number(weightKg);
    const heightCmNum =
      units === 'imperial' ? (Number(heightFt) * 12 + Number(heightIn)) * 2.54 : Number(heightCm);
    const lbmRaw = lbm ? Number(lbm) : 0;
    const lbmKg = lbm && units === 'imperial' ? lbmRaw * 0.453592 : lbmRaw;
    const fatKg = bodyFat ? weightKgNum * (Number(bodyFat) / 100) : 0;

    const bmr = formula.formula(sex, weightKgNum, heightCmNum, Number(age), lbmKg, fatKg);
    const calories = bmr * activity.factor;

    setLastGoal(goal);
    applyGoal(goal, calories, applyGoalSetters);
  };

  const bodyFatNum = Number(bodyFat);
  const hasBodyFat = bodyFat !== '' && !Number.isNaN(bodyFatNum) && bodyFatNum > 0;
  const autoLbmBase = units === 'imperial'
    ? Number(weightLbs) * (1 - bodyFatNum / 100)
    : Number(weightKg) * (1 - bodyFatNum / 100);
  const autoLbmUnit = units === 'imperial' ? 'lbs' : 'kg';
  const autoLbm = hasBodyFat ? `${autoLbmBase.toFixed(1)} ${autoLbmUnit}` : null;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Calorie Calculator</Text>
        <Text style={styles.subtitle}>
          Estimate the number of daily calories your body needs to maintain your current weight.
        </Text>

        {/* Formula */}
        <Text style={styles.label}>Formula</Text>
        <TouchableOpacity style={styles.pickerButton} onPress={() => setShowFormulaPicker(true)}>
          <Text style={styles.pickerButtonText}>{formula.label}</Text>
          <Text style={styles.pickerChevron}>▾</Text>
        </TouchableOpacity>
        <Text style={styles.hint}>{formula.description}</Text>

        {/* Units */}
        <View style={styles.segmentRow}>
          <Text style={styles.label}>Units</Text>
          <View style={styles.segment}>
            {(['metric', 'imperial'] as Units[]).map(u => (
              <TouchableOpacity
                key={u}
                style={[styles.segmentBtn, units === u && styles.segmentBtnActive]}
                onPress={() => setUnits(u)}
              >
                <Text style={[styles.segmentBtnText, units === u && styles.segmentBtnTextActive]}>
                  {u === 'metric' ? 'Metric' : 'US units'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Age */}
        <Text style={styles.label}>Age (years)</Text>
        <TextInput
          style={[styles.input, errors.age && styles.inputError]}
          keyboardType="numeric"
          value={age}
          onChangeText={setAge}
          placeholder="e.g. 25"
          placeholderTextColor="#888"
        />
        {errors.age ? <Text style={styles.errorText}>{errors.age}</Text> : null}

        {/* Height */}
        <HeightInputs
          units={units}
          heightFt={heightFt} heightIn={heightIn} heightCm={heightCm}
          errors={errors}
          setHeightFt={setHeightFt} setHeightIn={setHeightIn} setHeightCm={setHeightCm}
        />

        {/* Weight */}
        <WeightInput
          units={units}
          weightLbs={weightLbs} weightKg={weightKg}
          errors={errors}
          setWeightLbs={setWeightLbs} setWeightKg={setWeightKg}
        />

        {/* Body Fat */}
        {formula.needsFat ? (
          <BodyFatInput bodyFat={bodyFat} error={errors.bodyFat} onChange={setBodyFat} />
        ) : null}

        {/* Lean Body Mass */}
        {formula.needsLBM ? (
          <LBMInput
            units={units} lbm={lbm} error={errors.lbm}
            autoLbm={autoLbm} onChange={setLbm}
          />
        ) : null}

        {/* Sex */}
        <Text style={styles.label}>Sex</Text>
        <View style={styles.row}>
          {(['male', 'female'] as Sex[]).map(s => (
            <TouchableOpacity
              key={s}
              style={[styles.radioBtn, sex === s && styles.radioBtnActive]}
              onPress={() => setSex(s)}
            >
              <Text style={[styles.radioBtnText, sex === s && styles.radioBtnTextActive]}>
                {s === 'male' ? 'Male' : 'Female'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Activity Level */}
        <Text style={styles.label}>Activity Level</Text>
        <TouchableOpacity style={styles.pickerButton} onPress={() => setShowActivityPicker(true)}>
          <Text style={styles.pickerButtonText}>{activity.short}</Text>
          <Text style={styles.pickerChevron}>▾</Text>
        </TouchableOpacity>
        <Text style={styles.hint}>{activity.label}</Text>

        {/* Goal */}
        <Text style={styles.label}>Goal</Text>
        <View style={styles.row}>
          {(['lose', 'maintain', 'gain'] as Goal[]).map(g => (
            <TouchableOpacity
              key={g}
              style={[styles.radioBtn, goal === g && styles.radioBtnActive]}
              onPress={() => setGoal(g)}
            >
              <Text style={[styles.radioBtnText, goal === g && styles.radioBtnTextActive]}>
                {g.charAt(0).toUpperCase() + g.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Submit */}
        <TouchableOpacity style={styles.calcButton} onPress={handleCalculate}>
          <Text style={styles.calcButtonText}>{result === null ? 'Calculate' : 'Recalculate'}</Text>
        </TouchableOpacity>

        {/* Results */}
        {result !== null && (
          <ResultCard
            result={result}
            lastGoal={lastGoal}
            lossResults={lossResults}
            gainResults={gainResults}
          />
        )}
      </ScrollView>

      <PickerModal
        visible={showActivityPicker}
        items={activityOptions.map(a => ({ value: a.value, label: a.short, sublabel: a.label }))}
        selected={activity.value}
        onSelect={item => {
          const found = activityOptions.find(a => a.value === item.value);
          if (found) setActivity(found);
        }}
        onClose={() => setShowActivityPicker(false)}
      />

      <PickerModal
        visible={showFormulaPicker}
        items={formulaOptions.map(f => ({ value: f.value, label: f.label, sublabel: f.description }))}
        selected={formula.value}
        onSelect={item => {
          const found = formulaOptions.find(f => f.value === item.value);
          if (found) setFormula(found);
        }}
        onClose={() => setShowFormulaPicker(false)}
      />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { paddingHorizontal: 20, paddingBottom: 40 },
  marginLeft: { marginLeft: 12 },

  title: { fontSize: 26, fontWeight: '700', color: GOLD, textAlign: 'center', marginTop: 24, marginBottom: 6 },
  subtitle: { fontSize: 13, color: '#555', textAlign: 'center', marginBottom: 24, lineHeight: 18 },

  label: { fontSize: 14, fontWeight: '600', color: '#222', marginTop: 16, marginBottom: 4 },
  hint: { fontSize: 12, color: '#888', marginTop: 4 },
  errorText: { fontSize: 11, color: '#e53e3e', marginTop: 3 },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#111',
    backgroundColor: '#fafafa',
  },
  inputError: { borderColor: '#e53e3e' },

  row: { flexDirection: 'row', gap: 12, marginTop: 4 },
  flex1: { flex: 1 },

  segmentRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 },
  segment: { flexDirection: 'row', borderRadius: 8, borderWidth: 1, borderColor: '#ddd', overflow: 'hidden' },
  segmentBtn: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#f5f5f5' },
  segmentBtnActive: { backgroundColor: GOLD },
  segmentBtnText: { fontSize: 13, fontWeight: '600', color: '#555' },
  segmentBtnTextActive: { color: '#fff' },

  radioBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  radioBtnActive: { backgroundColor: GOLD, borderColor: GOLD },
  radioBtnText: { fontSize: 13, fontWeight: '600', color: '#555' },
  radioBtnTextActive: { color: '#fff' },

  pickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fafafa',
  },
  pickerButtonText: { fontSize: 14, color: '#111', flex: 1 },
  pickerChevron: { fontSize: 14, color: '#888', marginLeft: 8 },

  calcButton: {
    marginTop: 28,
    backgroundColor: GOLD,
    borderRadius: 100,
    paddingVertical: 14,
    alignItems: 'center',
  },
  calcButtonText: { fontSize: 15, fontWeight: '700', color: '#fff' },

  resultCard: {
    marginTop: 28,
    backgroundColor: '#fdf6e9',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#f0c46a',
  },
  resultTitle: { fontSize: 15, fontWeight: '700', color: GOLD, textAlign: 'center' },
  resultValue: { fontSize: 32, fontWeight: '800', color: '#111', textAlign: 'center', marginTop: 6 },
  resultSubtext: { fontSize: 12, color: '#666', textAlign: 'center', marginTop: 4, marginBottom: 16 },

  breakdownList: { marginTop: 8, gap: 12 },
  breakdownRow: {
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#f0c46a',
  },
  breakdownLabel: { fontSize: 13, fontWeight: '700', color: GOLD },
  breakdownValue: { fontSize: 14, fontWeight: '600', color: '#111', marginTop: 2 },
  breakdownPct: { fontSize: 12, color: '#888', fontWeight: '400' },
  breakdownRate: { fontSize: 11, color: '#aaa', marginTop: 1 },

  mealPrepButton: {
    marginTop: 20,
    backgroundColor: GOLD,
    borderRadius: 100,
    paddingVertical: 12,
    alignItems: 'center',
  },
  mealPrepButtonText: { fontSize: 13, fontWeight: '700', color: '#fff' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  modalSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 32,
    maxHeight: '70%',
  },
  modalHandle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ddd',
    marginVertical: 10,
  },
  modalItem: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  modalItemSelected: { backgroundColor: '#fdf6e9' },
  modalItemLabel: { fontSize: 14, fontWeight: '600', color: '#222' },
  modalItemLabelSelected: { color: GOLD },
  modalItemSublabel: { fontSize: 12, color: '#888', marginTop: 2 },
});
