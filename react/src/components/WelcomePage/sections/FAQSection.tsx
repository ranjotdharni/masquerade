import { useState, type MouseEvent } from "react"
import { APP_NAME } from "../../../lib/constants"
import { MinusCircle, PlusCircle } from "lucide-react"

type FAQType = {
    question: string
    answer: string
}

function FAQ({ question, answer } : FAQType) {
    const [open, setOpen] = useState<boolean>(false)

    function toggle(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        setOpen(prev => !prev)
    }

    return (
        <li className="w-4/5 max-w-275 border-b border-b-2 border-text text-text px-2 py-4">
            <header className="flex flex-row justify-between items-center">
                <h4 className="text-[1.25rem] font-jbm-italic">{question}</h4>
                <button onClick={toggle} className="hover:cursor-pointer hover:text-primary scale-105">
                    {
                        open ? 
                        <MinusCircle /> :
                        <PlusCircle />
                    }
                </button>
            </header>

            <article style={{display: open ? "block" : "none"}} className="py-4 font-jbm text-secondary">
                <p>{answer}</p>
            </article>
        </li>
    )
}

export default function FAQSection() {
    const faqs: FAQType[] = [
        {
            question: `How does ${APP_NAME} preserve privacy?`,
            answer: `
                Your email. That's it. That is the minimum personal information we require from you to provide these services. 
                We recommend you use a trusted or dedicated mailbox specifically for ${APP_NAME}. Your email will NEVER be 
                shared with anyone or anywhere. It serves simply as an identifier for you, however, other users will not be 
                given these details either directly or implicitly by the ${APP_NAME} service itself. Even when you send an 
                invite to a survey, no sensitive data is communicated. For private surveys (Invite Only), you would need to 
                have the email(s) of the to-be-invited party before the fact from an external source (outside of ${APP_NAME}).
            `,
        },
        {
            question: `Do I have to create an account to use ${APP_NAME}?`,
            answer: `
                Short answer: Yes, some sort of account made at some point or another is required. Long answer: You may create 
                an account with the ${APP_NAME} service itself, or use an existing account from Google or GitHub to log in. We 
                are heavily considering a plan to allow individuals who don't have an account to participate in public surveys 
                (e.g. the survey creator would need an account to create and review the public survey, but anyone would be able 
                to take the survey whether they have an account or not). The current plan revolves around a link-based invite 
                system (anyone with the link may participate). We need time to plan out the different elements of this idea 
                such as security implications and implementation details.
            `,
        },
        {
            question: `Is there any information that ${APP_NAME} does collect?`,
            answer: `
                No. Simple as that (we don't even store your password). ${APP_NAME} is an open-source project. This means 
                that the code behind the service can be viewed publicly by anyone, even you. You or any party of your choice 
                (developer, analyst, etc.) are welcome to hunt for evidence of data collection in the source code, can't say 
                you'll find any though. Besides this, ${APP_NAME} currently has a single developer working on everything you 
                see here and in the web app. Frankly, we do not have the time, money, manpower, or interest in logging, tracking, 
                or collecting your information.
            `,
        },
        {
            question: `What devices will ${APP_NAME} work on?`,
            answer: `
                In its current state, ${APP_NAME} runs entirely in the browser. This means that any device capable of 
                running your choice of modern web browser will run ${APP_NAME}. We recommend Mozilla Firefox, Google Chrome, Apple 
                Safari, or Microsoft Edge (Internet Explorer may give issue and for your sanity, we do not recommend you use it). 
                ${APP_NAME} has a responsive design; this means it conforms to common screen sizes for different devices, even 
                mobile browsers (try it yourself).
            `,
        },
        {
            question: `Does ${APP_NAME} have multiple subscription tiers?`,
            answer: `
                No, for now and the forseeable future, ${APP_NAME} will not have any sort of paid services. All features 
                currently present in the web app are completely free. Note that these services are limited as a result of the 
                ${APP_NAME} project's limited resources (time, money, developers). The service currently has a single developer 
                working on everything we offer. Although there are no plans for future expansions as of right now, these conditions 
                are subject to change (e.g. rise in popularity, more revenue, more development time).
            `,
        }
    ]

    return (
        <section className="w-full flex flex-col items-center space-y-6 mt-10 md:mt-20">
            <h3 className="text-[2rem] font-roboto-bold text-secondary">FAQ</h3>

            <ul className="w-full flex flex-col items-center">
                {
                    faqs.map((faq, index) => {
                        return (
                            <FAQ key={`LANDING_FAQ_ITEM_1x${index}`} question={faq.question} answer={faq.answer} />
                        )
                    })
                }
            </ul>
        </section>
    )
}
