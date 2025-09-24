const SYSTEM_PROMPT = `
Bu şablon, Unlayer Mail Editor’a gönderilecek tam JSON çıktısını üretmek içindir. Sadece JSON döndürün; açıklama ya da başka metin yazmayın.
1. Kök Düzey: counters, body, headers, footers, values
1.1 counters
Amaç: Şablon içinde kaç adet row, column, content menü/text/image/button/divider/heading öğesi oluşturulduğunu sayaçlar. Örnek:
"counters": {
"u_row": 8,
"u_column": 13,
"u_content_menu": 1,
"u_content_text": 24,
"u_content_image": 8,
"u_content_button": 2,
"u_content_divider": 1,
"u_content_heading": 3}

1.2 body
"body": {
"id": "0QFAKPxyzM",
"rows": [ /* row nesneleri */ ]}
id: Editörde her şablona atanan benzersiz kimlik.
rows: Şablondaki sıralı satırlar. Her satır kendi içinde cells, columns ve values tutar.

1.3 headers ve footers
Kullanılmıyorsa boş liste:
"headers": [],"footers": []

1.4 values (global ayarlar)
Şablonun genel popup/mobil/masaüstü, font, renk, arka plan gibi temel ayarlarını içerir. Örnek bazı alanlar:
popupPosition, popupWidth, popupHeight
borderRadius
contentAlign, contentVerticalAlign, contentWidth
fontFamily (label, value)
textColor
backgroundColor, backgroundImage
linkStyle (body, linkColor, linkHoverColor, linkUnderline…)
preheaderText vb.

2. Satırlar (body.rows)
Her row nesnesi şu üç ana bölümü içerir:
{
"id": "ROW_ID",
"cells": [ /* hücre sayısı listesi */ ],
"columns": [ /* column nesneleri */ ],
"values": { /* row’a özel stil ve davranış */ }}
cells: Satırda kaç adet hücre (column) olduğunu belirtir. Örneğin [1,1] iki hücre; [1] ise tek hücre olduğunu gösterir.
columns: Her hücre için birer column nesnesi (hepsi aşağıda).
values:
backgroundColor, backgroundImage
padding
displayCondition, hideDesktop
CSS sınıf ve ID bilgileri (_meta.htmlID, _meta.htmlClassNames)
Taşınabilirlik (selectable, draggable, duplicatable, deletable, hideable, locked)

3. Sütunlar (row.columns)
Her sütun şöyle tanımlanır:
{
"id": "COLUMN_ID",
"contents": [ /* content blokları */ ],
"values": { /* column’a özel stil */ }}
id: Benzersiz sütun kimliği.
contents: O sütunda yer alan bloklar (image, heading, text, button, menu, divider).
values:
padding, border, borderRadius
backgroundColor
Meta ve taşınabilirlik ayarları

4. İçerik Blokları (column.contents)
Aşağıda JSON’da görebileceğiniz 6 temel içerik tipi için ortak ve özel alanlar listelenmiştir. Her blokta mutlaka şunlar bulunur:
id: Benzersiz içerik kimliği.
type: image, heading, text, button, menu, divider.
values: Tipine göre değişen stil / veri.

4.1 image
{
"type": "image",
"values": {
"containerPadding": "10px 10px 0px",
"src": {
"url": "...",
"width": 116,
"height": 116,
"maxWidth": "15%",
"autoWidth": false,
"dynamic": true
},
"textAlign": "center",
"altText": "",
"action": { "name":"web", "values":{ "href":"", "target":"_blank" } },
"hideDesktop": false,
"_meta": { "htmlID":"u_content_image_1" },
"_override": { "mobile": { /* mobil override */ } }
}}
src: url, width/height, % bazlı maxWidth, autoWidth, dynamic.
action: Tıklanınca gidecek link.
_override.mobile: Mobilde farklı maxWidth, fontSize vb.

4.2 heading
{
"type": "heading",
"values": {
"headingType": "h1", // h1, h2, h3…
"text": "<span>Başlık</span>",
"fontSize": "48px",
"fontWeight": 400,
"color": "#ffffff",
"textAlign": "center",
"lineHeight": "140%",
"linkStyle": { /* link renk / alt çizgi */ },
"_override": { "mobile": { "fontSize":"45px" } }
}}
headingType: HTML başlık seviyesi.
text: HTML içeren metin.
Stil: fontSize, fontWeight, color, textAlign, lineHeight.

4.3 text
{
"type": "text",
"values": {
"containerPadding": "10px",
"fontSize": "17px",
"color": "#0071e3",
"textAlign": "left",
"lineHeight": "140%",
"text": "<p>Paragraf içeriği.</p>",
"_override": { "mobile": { "textAlign":"center" } }
}}

text: HTML paragraf etiketleriyle zenginleştirilmiş.
Metin stili: fontSize, color, lineHeight, textAlign.

4.4 button
{
"type": "button",
"values": {
"href": { "name":"web", "values":{ "href":"", "target":"_blank" } },
"buttonColors": {
"color":"#FFFFFF", "backgroundColor":"#0071e3",
"hoverColor":"#FFFFFF", "hoverBackgroundColor":"#3AAEE0"
},
"size": { "autoWidth": true, "width":"100%" },
"fontSize": "17px",
"padding": "10px 20px",
"borderRadius": "25px",
"text": "<span>Buy</span>",
"_override": { "mobile": { "textAlign":"center" } }
}}
buttonColors: Yazı ve arka plan renkleri (hover dahil).
size: autoWidth veya yüzde/veri piksel genişlik.
padding, borderRadius.

4.5 menu
{
"type": "menu",
"values": {
"menu": {
"items": [
{ "key":"…", "text":"Shop Online", "link":{ "values":{ "href":"…", "target":"_self" } } },
/* … */
]
},
"fontSize":"14px",
"textColor":"#424245",
"linkColor":"#d2d2d7",
"align":"center",
"layout":"horizontal",
"separator":"|",
"_override": { "mobile": { "layout":"vertical" } }
}}

items: text ve link içeren menü elemanları.
layout: horizontal veya vertical.
separator, align.

4.6 divider
{
"type": "divider",
"values": {
"width":"100%",
"border": {
"borderTopWidth":"1px",
"borderTopStyle":"solid",
"borderTopColor":"#424245"
},
"containerPadding":"10px"
}}
Sadece çizgi (üst kenar) genişlik, stil ve renk ayarları.

5. Adım Adım Manuel Oluşturma Süreci
JSON Kökünü Oluşturun
{
"counters": { /* otomatik sayaçlar */ },
"body": { "id":"…", "rows": [] },
"headers": [],
"footers": [],
"values": { /* global ayarlar */ }}


body.rows.push({
"id":"row1", "cells":[1], "columns":[], "values":{ /* stil */ }});
Sütun ve İçerik Blokları Tanımlayın
Her sütuna id, contents: [], values.
Her içerik bloğunu typeına göre yukarıdaki şablonlara sadık kalarak ekleyin.
Mobil Override ve Meta Bilgilerini Ayarlayın
values._override.mobile içindeki farklı font veya düzen gereksinimlerine dikkat edin.
Her öğenin _meta.htmlID ve _meta.htmlClassNames değerlerinin benzersiz olmasına özen gösterin.

MetaId kısımlarını kendin rastgele bir değer ver. Eğer yer tutucu ve resim url eklemek gerekiyorsa, lütfen {{variableName}} olarak yaz ve variableName camelCase olarak ve ingilizce alfabesi kullanarak yazılsın. Örneğin {{userName}}, {{userAge}} gibi. Örneğin {{userName}}, {{userAge}} {{logoUrl}} gibi. Tam JSON’u bu örneklere bakarak, eksiksiz ve geçerli biçimde oluşturun.  
`;

import fs from "fs";
import path from "path";

// import Google GenAI SDK
import { GoogleGenAI } from "@google/genai";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

// POST method to handle design generation using Gemini AI
export async function POST(req: NextRequest) {
    const { prompt, design } = await req.json();

    // Combine Prompt with system prompt and current design
    const fullPrompt = `${SYSTEM_PROMPT}\nKullanıcı promptu: ${prompt}\nMevcut design JSON:\n${JSON.stringify(
        design
    )}`;

    // const response = await fetch(
    //     "https://generativeai.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY",
    //     {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify({
    //             contents: [{ parts: [{ text: fullPrompt }] }],
    //         }),
    //     }
    // );

    const model = process.env.GOOGLE_GENAI_MODEL;
    if (!model) {
        return new Response(
            JSON.stringify({ error: "GOOGLE_GENAI_MODEL environment variable is not set" }),
            { status: 500 }
        );
    }

    // Generate content using Gemini AI
    const response = await ai.models.generateContent({
        model: model,
        contents: fullPrompt,
        // maxOutputTokens: 5000,
    });
    // console.log(response.candidates[0].content.parts[0].text);

    // Extract the design JSON from the response returned by Gemini
    let newDesign = null;
    try {
        let text: string | undefined;
        if (
            response.candidates &&
            response.candidates[0] &&
            response.candidates[0].content &&
            response.candidates[0].content.parts &&
            response.candidates[0].content.parts[0] &&
            typeof response.candidates[0].content.parts[0].text === "string"
        ) {
            text = response.candidates[0].content.parts[0].text;
        } else {
            throw new Error("AI response is missing expected content structure.");
        }
        text = text.trim();
        // Remove code block markers if present
        // This regex removes ```json and ``` from the start and end of the text
        text = text.replace(/```json\s*|```/g, "").trim();

        newDesign = JSON.parse(text);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
        // --- Dosyaya yazma işlemi ---
        let aiText = "";
        if (
            response.candidates &&
            response.candidates[0] &&
            response.candidates[0].content &&
            response.candidates[0].content.parts &&
            response.candidates[0].content.parts[0] &&
            typeof response.candidates[0].content.parts[0].text === "string"
        ) {
            aiText = response.candidates[0].content.parts[0].text;
        }
        const filePath = path.join(process.cwd(), "tmp", "gemini-result.txt");
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.writeFileSync(filePath, aiText, "utf8");
        return new NextResponse(
            JSON.stringify({ error: "Invalid design JSON from AI" }),
            { status: 400 }
        );
    }

    return new NextResponse(JSON.stringify({ design: newDesign }), { status: 200 });
}