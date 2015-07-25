import evaluate from '../lib/evaluate'

import exampleStudent from '../example-students/studio-art.json'
import studioArt from '../dist/majors/studio-art.yaml.json'

function checkAgainstArea() {
    const {courses, overrides} = exampleStudent
    console.profile('evaluate')
    const result = evaluate({courses, overrides}, studioArt)
    console.profileEnd('evaluate')
    console.log(result)
}

checkAgainstArea()
