import type { UniformSectionType } from "../../lib/types/client"
import UniformArticle from "./UniformArticle"

export default function UniformSection({ title, content, reverseTitle } : UniformSectionType & { reverseTitle?: boolean }) {

    return (
        <section className="relative max-w-420 w-[95%] mx-auto mb-14">
            <h2 style={{justifyContent: reverseTitle ? "end" : "start"}} className="mb-8 px-2 font-jbm-bold text-text text-[2rem] border-b flex flex-row items-center">{title}</h2>
            {
                content.map((article, index) => {
                    return <UniformArticle key={`USAGE_PAGE_ARTICLE_${article.type}_1x${index}`} content={article} />
                })
            }
        </section>
    )
}
