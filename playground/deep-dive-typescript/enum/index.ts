// =============================
// 1. 数値列挙型 (Numeric Enums)
// =============================

// 数値列挙型では、最初のメンバはデフォルトで 0 から始まり、
// 以降のメンバは 1 ずつ増加します。
// biome-ignore lint/style/useEnumInitializers: sample code
enum CardSuit {
	Clubs, // 0
	Diamonds, // 1
	Hearts, // 2
	Spades, // 3
}

// Enumの使用例
const card: CardSuit = CardSuit.Clubs; // Clubs は 0
console.log(card); // 出力: 0
console.log(CardSuit[0]); // 出力: "Clubs" (逆引きが可能)

// -----------------------------
// 明示的に数値を割り当てる場合
// -----------------------------

enum Tristate {
	False = 0, // 明示的に 0 を割り当て
	True = 1, // 1
	Unknown = 2, // 2
}

console.log(Tristate[0]); // 出力: "False"
console.log(Tristate.False); // 出力: 0

// ==========================================
// 2. フラグとしての数値列挙型 (Bitwise Flags)
// ==========================================

// フラグ列挙型では、ビット演算を使って複数のオプションを組み合わせることができます。
enum AnimalFlags {
	None = 0, // 0000 (何もなし)
	HasClaws = 1 << 0, // 0001 (1) (爪を持つ)
	CanFly = 1 << 1, // 0010 (2) (飛べる)
	EatsFish = 1 << 2, // 0100 (4) (魚を食べる)
	Endangered = 1 << 3, // 1000 (8) (絶滅危惧種)
}

// フラグの組み合わせ: | (ビット OR)
const myAnimal = AnimalFlags.HasClaws | AnimalFlags.CanFly; // 0001 | 0010 = 0011 (3)

// フラグの判定: & (ビット AND)
function checkAnimal(animal: AnimalFlags) {
	if (animal & AnimalFlags.HasClaws) {
		console.log("この動物は爪を持っています。");
	}
	if (animal & AnimalFlags.CanFly) {
		console.log("この動物は飛べます。");
	}
}

checkAnimal(myAnimal);
// 出力:
// "この動物は爪を持っています。"
// "この動物は飛べます。"

// =============================
// 3. 文字列列挙型 (String Enums)
// =============================

// 数値ではなく、文字列を値として持つ列挙型。
// 文字列列挙型を使うと、デバッグ時に値がわかりやすくなります。
enum EvidenceTypeEnum {
	UNKNOWN = "",
	PASSPORT_VISA = "passport_visa",
	PASSPORT = "passport",
	SIGHTED_STUDENT_CARD = "sighted_tertiary_edu_id",
}

// 使用例
const value: EvidenceTypeEnum = EvidenceTypeEnum.PASSPORT;
console.log(value); // 出力: "passport"

// 文字列の比較が簡単にできる
if (value === EvidenceTypeEnum.PASSPORT) {
	console.log("パスポートを提供しました。");
}

// =============================
// 4. 定数列挙型 (Const Enums)
// =============================

// `const enum` を使うと、コンパイル時に列挙型の値がインライン展開され、
// JavaScriptの出力コードが最適化されます。
// biome-ignore lint/style/useEnumInitializers: sample code
enum TristateConst {
	False,
	True,
	Unknown,
}

// `TristateConst.False` はコンパイル後に `0` に置き換えられる
const lie: TristateConst = TristateConst.False;
console.log(lie); // 出力: 0

// ========================================
// 5. 列挙型に静的メソッドを追加 (Enum with Static Functions)
// ========================================

// 通常の Enum には関数を追加できませんが、Namespace を使うとメソッドを定義できます。
// biome-ignore lint/style/useEnumInitializers: sample code
enum Weekday {
	Monday,
	Tuesday,
	Wednesday,
	Thursday,
	Friday,
	Saturday,
	Sunday,
}

// Namespace を利用してメソッドを追加
namespace Weekday {
	export function isBusinessDay(day: Weekday): boolean {
		return day >= Weekday.Monday && day <= Weekday.Friday;
	}
}

console.log(Weekday.isBusinessDay(Weekday.Monday)); // 出力: true
console.log(Weekday.isBusinessDay(Weekday.Saturday)); // 出力: false

// =============================
// 6. 拡張可能な列挙型 (Open-ended Enums)
// =============================

// TypeScript では同じ Enum を複数回宣言することで拡張できます。
// biome-ignore lint/style/useEnumInitializers: sample code
enum Color {
	Red,
	Green,
	Blue,
}

// 別のブロックで追加
// biome-ignore lint/style/useEnumInitializers: sample code
enum Color {
	DarkRed = 3, // 3を指定して開始
	DarkGreen, // 4
	DarkBlue, // 5
}

console.log(Color.DarkRed); // 出力: 3
console.log(Color.DarkGreen); // 出力: 4
console.log(Color.DarkBlue); // 出力: 5
