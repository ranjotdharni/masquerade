import AppContent from "../components/layout/AppContent"
import SampleData from "../sampledata/surveys.json"
import MySurveyList from "../components/MySurveysPage/MySurveyList"
import MySurveyHeader from "../components/MySurveysPage/MySurveyHeader"

export default function MySurveysPage() {

    return (
        <AppContent reserveNavSpace className="border-b border-primary">
            <MySurveyHeader username="ranjotdharni1@gmail.com" numberOfSurveys={SampleData.content.length} />
            <section className="w-full h-3/4 px-2">
                <MySurveyList surveys={SampleData.content.map(s => { return {...s, questions: undefined, numberOfQuestions: s.questions.length } })} />
            </section>
        </AppContent>
    )
}
