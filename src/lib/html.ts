/** Rich-text output counts as empty when it holds only tags / &nbsp; (e.g. "<p><br></p>"). */
export const isBlankHtml = (html: string) => html.replace(/<[^>]*>|&nbsp;/g, "").trim() === "";
