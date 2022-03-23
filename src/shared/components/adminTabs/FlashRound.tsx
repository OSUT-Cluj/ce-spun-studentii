import { Button, FormControl, FormControlLabel, Grid, InputLabel, Menu, MenuItem, Paper, Select, Switch } from '@mui/material';
import { getDatabase, onValue, ref, update } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { Question } from '../../models/question';
import { db } from '../../../utils/firebase/firebase';
import { useObjectVal } from 'react-firebase-hooks/database';
import { DB, DBQuestion } from '../../models/db';



const FlashRound = (props: any) => {

    const [questions, setQuestions] = useState<DBQuestion[]>([]);
    const [newChange, setNewChange] = useState(false);
    const [selected, setSelected] = useState(0);
    const [curent, setCurent] = useState(new Question());

    const [doublePoints, setDoublePoints] = useState(false);
    const [triplePoints, setTriplePoints] = useState(false);

    const [revealed, setRevealed] = useState(false)

    const [dbValue] = useObjectVal<DB>(ref(db, '/'));

    const [flashQuestion, setFlashQuestion] = useState(dbValue?.questions[20]);

    let questionArray: DBQuestion[];

    
    questionArray = [
        questions[0],
        questions[0],
        questions[0],
        questions[0],
        questions[0],
    ];
    
    



    useEffect(() => {
        if (dbValue) {
            setQuestions(dbValue.questions);
        }

        


    }, [dbValue])

    const resetDbValues = () => {
        if (dbValue) {
            const newQuestions = dbValue.questions.map(question => {
                const newAnswers = question.answers.map(answer => {
                    return {
                        ...answer,
                        revealed: false,
                    }
                })
                return {
                    ...question,
                    answers: newAnswers,
                    revealed: false
                }
            })
            update(ref(db, '/'), { questions: newQuestions });
        }
    }

    const handleChange = (event: any) => {
        resetDbValues();
        setSelected((event.target.value));
        setRevealed(false);
        update(ref(db, '/'), {
            currentQuestion: event.target.value
        })
    }

    const handleRevealedChange = (event: any) => {
        setRevealed(event.target.checked);
        questions[selected].revealed = !revealed;

        update(ref(db, "/"), {
            questions: questions,
        });

    }

    const handleRevealAnswer = (event: any, index: number) => {
        // const newRevealedValue = event.target.checked;
        // const newQuestions = questions.map((question, questionIndex) => {
        //     if (questionIndex === selected && question.answers) {
        //         const newAnswers = question.answers.map((answer, answerIndex) => {
        //             if (answerIndex === index) {
        //                 return {
        //                     ...answer,
        //                     revealed: newRevealedValue,
        //                 }
        //             }
        //             return answer;
        //         });
        //         return {
        //             ...question,
        //             answers: newAnswers,
        //         }
        //     }
        //     return question;
        // });
        

        setFlashQuestion({
            "answers": [
              questions[0].answers[index],
              questions[1].answers[index],
              questions[2].answers[index],
              questions[3].answers[index],
              questions[4].answers[index],
            ],
            "id": 20,
            "revealed": false,
            "text": "RUNDA FLASH"
          })

        console.log(flashQuestion);
        
        const newQuestions = questions;



        setQuestions(newQuestions);
        update(ref(db, '/'), {
            questions: newQuestions
        })
    }

    const addPointsToTeam = (teamNumber: number) => {

        let points = 0;
        questions[selected].answers.map(answer => {
            if (answer.revealed) {
                points += answer.points;
            }
        })

        if (doublePoints) {
            points *= 2;
        }
        if (triplePoints) {
            points *= 3;
        }

        if (teamNumber === 1 && dbValue) {
            const newTeam1Points = dbValue?.team1.points + points;
            update(ref(db, '/team1'), {
                points: newTeam1Points
            });
        }
        if (teamNumber === 2 && dbValue) {
            const newTeam2Points = dbValue?.team2.points + points;
            update(ref(db, '/team2'), {
                points: newTeam2Points
            });
        }
    }


    const handlePointsMultiplier = (event: any, type: number) => {
        const checkedValue = event.target.checked;
        if (type === 1) {
            setDoublePoints(checkedValue);
            setTriplePoints(false);
            update(ref(db, '/'), {
                pointsMultiplier: checkedValue ? 2 : 1
            })
        }
        else {
            setDoublePoints(false);
            setTriplePoints(checkedValue);
            update(ref(db, '/'), {
                pointsMultiplier: checkedValue ? 3 : 1
            })
        }
    }


    return (


        <Grid container spacing={2} sx={{ width: 1 / 2 }}>
            <Grid item xs={12}>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="demo-simple-select-label">Intrebare</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selected}
                        label="Numar Intrebare"
                        onChange={handleChange}

                    >
                        {questions.map((q: DBQuestion, index) => {
                            return (
                                <MenuItem key={index} value={index}>{q.text}</MenuItem>
                            )

                        })}
                    </Select>
                </FormControl>
            </Grid>
            

            {questions[selected] ? questions[selected].answers.map((answer, index) => {
                return (
                    <Grid container spacing={2} key={index}>
                        <Grid item xs={8}>
                            <Paper style={{ backgroundColor: '#ededed', padding: 10, margin: 5 }}>
                                <p style={{ textAlign: 'left' }}>{answer.text}</p>
                            </Paper>
                        </Grid>
                        <Grid item xs={4}>
                            <FormControl component="fieldset" variant="standard">
                                <FormControlLabel
                                    control={
                                        <Switch checked={answer.revealed} onChange={(event) => handleRevealAnswer(event, index)} name="revealed" />
                                    }
                                    label="Punctat"
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                )
            }) : null}

            

        </Grid>

        

        
    )
}

export default FlashRound;