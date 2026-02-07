import { SINGLE_IMAGE_UNIFORM_ARTICLE_ID } from "../../lib/constants"
import type { DualImageUniformArticleType, SingleImageUniformArticleType, UniformArticleType } from "../../lib/types/client"

const containerTailwind: string = "w-full px-4 flex flex-col items-center mb-12"
const imgTailwind: string = "mb-6 border-2 border-accent dark:border-text rounded-xl shadow"
const textTailwind: string = "w-full font-jbm text-secondary dark:text-accent"

function SingleImageArticle({ src, text } : SingleImageUniformArticleType) {
    const imgWidthTailwind: string = "w-full md:w-[55%] " // ensure spacing at the end

    return (
        <article className={containerTailwind}>
            <img src={src} className={imgWidthTailwind + imgTailwind} />
            <p className={textTailwind}>{text}</p>
        </article>
    )
}

function DualImageArticle({ src, text } : DualImageUniformArticleType) {
    const imgWidthTailwind: string = "w-full md:w-[45%] " // ensure spacing at the end

    return (
        <article className={containerTailwind}>
            <span className="flex flex-col md:flex-row justify-evenly items-center w-full">
                <img className={imgWidthTailwind + imgTailwind} src={src[0]} />
                <img className={imgWidthTailwind + imgTailwind} src={src[1]} />
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
