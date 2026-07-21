/**
 * ba-docx house style helpers for docx-js.
 *
 * Usage:
 *   const S = require("./styles");
 *   const doc = new (require("docx").Document)({
 *     styles: S.docStyles(), numbering: S.numbering(),
 *     sections: [{ properties: S.pageProps(), footers: S.footer("Tên tài liệu"),
 *       children: [ ...S.cover({label, title, subtitle, author, version, date}),
 *                   ...S.toc(), S.h1("Mục đầu", "1"), S.para("..."),
 *                   S.dataTable([w1,w2], ["A","B"], [[...],[...]]),
 *                   S.bullet("..."), S.calloutBox([["nhãn","nội dung"]]), ] }]
 *   });
 *
 * Install: npm install docx   (run inside the working dir)
 */
const fs = require("fs");
const d = require("docx");
const { Document, Paragraph, TextRun, Table, TableRow, TableCell, ImageRun,
  Footer, AlignmentType, LevelFormat, TabStopType, TableOfContents, HeadingLevel,
  BorderStyle, WidthType, ShadingType, VerticalAlign, PageNumber, PageBreak } = d;

// ---- Palette & metrics ----
const CONTENT_W = 9360;            // US Letter, lề 1 inch
const BLUE = "1F4E79", BLUE2 = "2E5496", LBLUE = "D6E4F0";
const GREY = "F2F2F2", LINE = "BFBFBF", MUTE = "808080";
const BODY = 22;                   // 11pt (nửa-điểm)
const FONT = "Times New Roman";
const border = { style: BorderStyle.SINGLE, size: 4, color: LINE };
const allBorders = { top: border, bottom: border, left: border, right: border,
  insideHorizontal: border, insideVertical: border };
const cellMargins = { top: 60, bottom: 60, left: 110, right: 110 };

function pageProps() {
  return { page: { size: { width: 12240, height: 15840 },
    margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } };
}

function docStyles() {
  return {
    default: { document: { run: { font: FONT, size: BODY } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, color: BLUE, font: FONT },
        paragraph: { spacing: { before: 280, after: 140 }, outlineLevel: 0,
          border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: BLUE, space: 4 } } } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, color: BLUE2, font: FONT },
        paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 1 } },
    ],
  };
}

function numbering() {
  return { config: [
    { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•",
      alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 280 } } } }] },
    { reference: "steps", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.",
      alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 320 } } } }] },
  ] };
}

function footer(docTitle) {
  return { default: new Footer({ children: [new Paragraph({
    tabStops: [{ type: TabStopType.RIGHT, position: CONTENT_W }],
    border: { top: { style: BorderStyle.SINGLE, size: 4, color: LINE, space: 4 } },
    children: [
      new TextRun({ text: docTitle, size: 16, color: MUTE }),
      new TextRun({ text: "\tTrang ", size: 16, color: MUTE }),
      new TextRun({ children: [PageNumber.CURRENT], size: 16, color: MUTE }),
      new TextRun({ text: "/", size: 16, color: MUTE }),
      new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 16, color: MUTE }),
    ] })] }) };
}

// ---- Cover & TOC ----
function cover({ label, title, subtitle, author, version, date }) {
  const c = (children, opts = {}) => new Paragraph({ alignment: AlignmentType.CENTER, ...opts, children });
  const out = [
    new Paragraph({ spacing: { before: 2600 } }),
    c([new TextRun({ text: (label || "").toUpperCase(), size: 24, color: MUTE })], { spacing: { after: 120 } }),
    c([new TextRun({ text: (title || "").toUpperCase(), bold: true, size: 44, color: BLUE })], { spacing: { after: 200 } }),
  ];
  if (subtitle) out.push(c([new TextRun({ text: subtitle, size: 28, color: "404040" })], { spacing: { after: 600 } }));
  if (author)  out.push(c([new TextRun({ text: "Đơn vị soạn thảo: " + author, size: BODY })], { spacing: { after: 40 } }));
  if (version) out.push(c([new TextRun({ text: "Phiên bản: " + version, size: BODY })], { spacing: { after: 40 } }));
  if (date)    out.push(c([new TextRun({ text: "Ngày ban hành: " + date, size: BODY })]));
  out.push(new Paragraph({ children: [new PageBreak()] }));
  return out;
}

function toc(heading = "MỤC LỤC") {
  return [
    new Paragraph({ children: [new TextRun({ text: heading, bold: true, size: 28, color: BLUE })], spacing: { after: 160 } }),
    new TableOfContents("Muc luc", { hyperlink: true, headingStyleRange: "1-2" }),
    new Paragraph({ children: [new PageBreak()] }),
  ];
}

// ---- Headings & text ----
function h1(text, num) { return new Paragraph({ heading: HeadingLevel.HEADING_1,
  children: [new TextRun({ text: (num ? num + ". " : "") + text })] }); }
function h2(text) { return new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text })] }); }
function para(text) { return new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: 120, line: 300 },
  children: [new TextRun({ text, size: BODY })] }); }
function bullet(text) { return _listItem("bullets", text); }
function step(text)   { return _listItem("steps", text); }
function _listItem(ref, text) { return new Paragraph({ numbering: { reference: ref, level: 0 }, spacing: { after: 60, line: 290 },
  children: Array.isArray(text) ? text : [new TextRun({ text, size: BODY })] }); }
// run mạnh: in đậm phần nhãn rồi nối phần còn lại
function lead(label, rest) { return [new TextRun({ text: label, bold: true, size: BODY }), new TextRun({ text: rest, size: BODY })]; }

// ---- Tables ----
function _hCell(text, w) { return new TableCell({ width: { size: w, type: WidthType.DXA }, margins: cellMargins,
  shading: { fill: BLUE, type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER,
  children: [new Paragraph({ children: [new TextRun({ text, bold: true, color: "FFFFFF", size: 19 })] })] }); }
function _bCell(text, w, fill, center) { return new TableCell({ width: { size: w, type: WidthType.DXA }, margins: cellMargins,
  shading: fill ? { fill, type: ShadingType.CLEAR } : undefined, verticalAlign: VerticalAlign.CENTER,
  children: [new Paragraph({ alignment: center ? AlignmentType.CENTER : AlignmentType.LEFT,
    children: [new TextRun({ text, size: 19 })] })] }); }
/** widths: mảng DXA (tổng = 9360). header: mảng tiêu đề. rows: mảng các dòng. zebra mặc định bật. */
function dataTable(widths, header, rows, opts = {}) {
  const zebra = opts.zebra !== false, headed = opts.header !== false;
  const trs = [];
  if (headed) trs.push(new TableRow({ tableHeader: true, children: header.map((h, i) => _hCell(h, widths[i])) }));
  rows.forEach((r, ri) => { const fill = zebra && ri % 2 === 1 ? GREY : undefined;
    trs.push(new TableRow({ children: r.map((c, i) => _bCell(String(c), widths[i], fill, widths[i] < 700)) })); });
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: widths, borders: allBorders, rows: trs });
}
/** Bảng "Trường | Nội dung" (2 cột, không sọc, không header tô). pairs: [[trường, nội dung], ...] */
function infoTable(pairs, labelW = 2600) {
  const valueW = CONTENT_W - labelW;
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [labelW, valueW], borders: allBorders,
    rows: pairs.map(([k, v]) => new TableRow({ children: [
      _bCell(k, labelW, GREY, false), _bCell(v, valueW, undefined, false) ] })) });
}

// ---- Callout / note box ----
function calloutBox(paragraphs) {
  const kids = paragraphs.map((p, i) => new Paragraph({ alignment: AlignmentType.JUSTIFIED,
    spacing: { line: 300, after: i < paragraphs.length - 1 ? 100 : 0 },
    children: Array.isArray(p) ? p : [new TextRun({ text: p, size: BODY })] }));
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [CONTENT_W],
    borders: { left: { style: BorderStyle.SINGLE, size: 24, color: BLUE },
      top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
    rows: [new TableRow({ children: [new TableCell({ width: { size: CONTENT_W, type: WidthType.DXA },
      margins: { top: 100, bottom: 100, left: 200, right: 160 }, shading: { fill: LBLUE, type: ShadingType.CLEAR },
      children: kids })] })] });
}

// ---- Image + caption ----
function figure(pngPath, caption, w = 624, h) {
  const ratioH = h || Math.round(w * 0.57);
  return [
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 80, after: 80 },
      children: [new ImageRun({ type: "png", data: fs.readFileSync(pngPath), transformation: { width: w, height: ratioH },
        altText: { title: caption || "Hình", name: "figure", description: caption || "figure" } })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 160 },
      children: [new TextRun({ text: caption, italics: true, size: 19, color: "595959" })] }),
  ];
}

module.exports = { CONTENT_W, BLUE, BLUE2, LBLUE, GREY, LINE, BODY, FONT,
  pageProps, docStyles, numbering, footer, cover, toc,
  h1, h2, para, bullet, step, lead, dataTable, infoTable, calloutBox, figure };
