export function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

export function fmtHeader(d: Date): string {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const h24 = d.getHours();
  const ampm = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}  ${h12}:${pad2(d.getMinutes())} ${ampm}`;
}

export function dateToYMD(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export function dateToHM(d: Date): string {
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

export function safeNumber(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.round(n * 100) / 100;
}

/**
 * Tiny calculator evaluator: numbers + . and operators + - * /
 * Supports unary minus (e.g. -5, 3*-2).
 */
export function evalExpr(expr: string): number {
  const s = expr.replace(/\s+/g, "");
  if (!s) return 0;

  // tokenize
  const tokens: string[] = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if ((c >= "0" && c <= "9") || c === ".") {
      let j = i + 1;
      while (j < s.length) {
        const cj = s[j];
        if ((cj >= "0" && cj <= "9") || cj === ".") j++;
        else break;
      }
      tokens.push(s.slice(i, j));
      i = j;
      continue;
    }
    if (c === "+" || c === "-" || c === "*" || c === "/") {
      tokens.push(c);
      i++;
      continue;
    }
    i++;
  }

  // mark unary minus
  const t2: string[] = [];
  for (let k = 0; k < tokens.length; k++) {
    const t = tokens[k];
    const prev = t2[t2.length - 1];
    const prevIsOp =
      !prev ||
      prev === "+" ||
      prev === "-" ||
      prev === "*" ||
      prev === "/" ||
      prev === "u-";
    if (t === "-" && prevIsOp) t2.push("u-");
    else t2.push(t);
  }

  const prec: Record<string, number> = {
    "u-": 3,
    "*": 2,
    "/": 2,
    "+": 1,
    "-": 1,
  };
  const rightAssoc = new Set(["u-"]);

  // shunting yard
  const out: string[] = [];
  const ops: string[] = [];

  const isOp = (t: string) => t in prec;
  const isNum = (t: string) => /^(\d+(\.\d*)?|\.\d+)$/.test(t);

  for (const t of t2) {
    if (isNum(t)) {
      out.push(t);
      continue;
    }
    if (isOp(t)) {
      while (ops.length) {
        const top = ops[ops.length - 1];
        if (!isOp(top)) break;
        const pTop = prec[top];
        const pT = prec[t];
        const shouldPop = rightAssoc.has(t) ? pTop > pT : pTop >= pT;
        if (!shouldPop) break;
        out.push(ops.pop()!);
      }
      ops.push(t);
    }
  }
  while (ops.length) out.push(ops.pop()!);

  // eval RPN
  const st: number[] = [];
  for (const t of out) {
    if (isNum(t)) {
      st.push(parseFloat(t));
      continue;
    }
    if (t === "u-") {
      const a = st.pop();
      st.push(-(a ?? 0));
      continue;
    }
    const b = st.pop() ?? 0;
    const a = st.pop() ?? 0;
    if (t === "+") st.push(a + b);
    else if (t === "-") st.push(a - b);
    else if (t === "*") st.push(a * b);
    else if (t === "/") st.push(b === 0 ? 0 : a / b);
  }

  return safeNumber(st.pop() ?? 0);
}
