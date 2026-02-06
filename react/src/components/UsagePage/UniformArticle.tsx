import { SINGLE_IMAGE_UNIFORM_ARTICLE_ID } from "../../lib/constants"
import type { DualImageUniformArticleType, SingleImageUniformArticleType, UniformArticleType } from "../../lib/types/client"

const containerTailwind: string = "w-full px-4 flex flex-col items-center mb-12"
const imgTailwind: string = "mb-6 border-2 border-accent rounded-xl shadow"
const textTailwind: string = "w-full font-jbm text-text"

function SingleImageArticle({ src, text } : SingleImageUniformArticleType) {
    return (
        <article className={containerTailwind}>
            <img src={src} style={{width: "55%"}} className={imgTailwind} />
            <p className={textTailwind}>{text}</p>
        </article>
    )
}

function DualImageArticle({ src, text } : DualImageUniformArticleType) {
    const imgWidth: string = "45%"

    return (
        <article className={containerTailwind}>
            <span className="flex flex-row justify-evenly items-center w-full">
                <img style={{width: imgWidth}} className={imgTailwind} src={src[0]} />
                <img style={{width: imgWidth}} className={imgTailwind} src={src[1]} />
            </span>
            <p className={textTailwind}>{text}</p>
        </article>
    )
}

export default function UniformArticle({ content } : { content: UniformArticleType }) {
    return (
        content.type === SINGLE_IMAGE_UNIFORM_ARTICLE_ID ? 
        <SingleImageArticle type={content.type} src={content.src} text={content.text} /> : 
        <DualImageArticle type={content.type} src={content.src} text={content.text} />
    )
}
