"use client"

import { useState, useCallback, useRef } from "react"
import { cn } from "@/lib/utils"
import { allQuestions, type Question } from "@/lib/questions"
import { MoneyLadder } from "@/components/money-ladder"
import { Trophy, Zap, Users, RotateCcw } from "lucide-react"

type GameState = "start" | "playing" | "won" | "lost"
type AnswerState = null | "correct" | "wrong"
type OptionKey = "A" | "B" | "C" | "D"

function useSound() {
  const audioCtxRef = useRef<AudioContext | null>(null)

  const playBeep = useCallback((frequency: number, duration: number) => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      }
      const ctx = audioCtxRef.current
      if (ctx.state === "suspended") ctx.resume()
      const oscillator = ctx.createOscillator()
      const gain = ctx.createGain()
      oscillator.frequency.value = frequency
      oscillator.connect(gain)
      gain.connect(ctx.destination)
      gain.gain.setValueAtTime(0.1, ctx.currentTime)
      oscillator.start()
      oscillator.stop(ctx.currentTime + duration)
    } catch {
      // Audio not available
    }
  }, [])

  return { playBeep }
}

export function QuizGame() {
  const [gameState, setGameState] = useState<GameState>("start")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [answerState, setAnswerState] = useState<AnswerState>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<OptionKey | null>(null)
  const [hiddenOptions, setHiddenOptions] = useState<OptionKey[]>([])
  const [used5050, setUsed5050] = useState(false)
  const [usedPublic, setUsedPublic] = useState(false)
  const [publicHint, setPublicHint] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const { playBeep } = useSound()

  const currentQuestion: Question | undefined = allQuestions[currentIndex]
  const options: OptionKey[] = ["A", "B", "C", "D"]

  function startGame() {
    setGameState("playing")
    setCurrentIndex(0)
    setScore(0)
    setAnswerState(null)
    setSelectedAnswer(null)
    setHiddenOptions([])
    setUsed5050(false)
    setUsedPublic(false)
    setPublicHint(null)
    setMessage(null)
  }

  function handleAnswer(choice: OptionKey) {
    if (answerState !== null || !currentQuestion) return

    setSelectedAnswer(choice)

    if (choice === currentQuestion.correct) {
      playBeep(600, 0.2)
      setAnswerState("correct")
      setScore(currentQuestion.money)
      setMessage("Korrekt!")

      setTimeout(() => {
        const nextIndex = currentIndex + 1
        if (nextIndex < allQuestions.length) {
          setCurrentIndex(nextIndex)
          setAnswerState(null)
          setSelectedAnswer(null)
          setHiddenOptions([])
          setPublicHint(null)
          setMessage(null)
        } else {
          setGameState("won")
        }
      }, 1500)
    } else {
      playBeep(150, 0.5)
      setAnswerState("wrong")
      setMessage("Move repons!")

      setTimeout(() => {
        setGameState("lost")
      }, 1500)
    }
  }

  function use5050() {
    if (used5050 || !currentQuestion || answerState !== null) return
    const wrong = options.filter((o) => o !== currentQuestion.correct)
    const shuffled = wrong.sort(() => 0.5 - Math.random())
    setHiddenOptions(shuffled.slice(0, 2))
    setUsed5050(true)
    playBeep(400, 0.2)
  }

  function usePublic() {
    if (usedPublic || !currentQuestion || answerState !== null) return
    setPublicHint(`Piblik la di: ${currentQuestion.correct} (85%)`)
    setUsedPublic(true)
    playBeep(400, 0.2)
  }

  // Start Screen
  if (gameState === "start") {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="flex w-full max-w-md flex-col items-center gap-8 rounded-2xl border border-primary/40 bg-card p-8 text-center shadow-[0_0_40px_rgba(255,215,0,0.15)]">
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Trophy className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              KESYON KONESANS
            </h1>
            <p className="text-sm text-muted-foreground">
              Istwa & Biyoloji (9em - NS2)
            </p>
          </div>

          <div className="flex flex-col gap-2 text-left text-xs text-muted-foreground">
            <p>8 kesyon pou rive nan $1,000,000</p>
            <p>2 jokè: 50/50 ak Mande Piblik</p>
          </div>

          <button
            onClick={startGame}
            className="w-full rounded-xl bg-primary px-6 py-4 text-lg font-bold text-primary-foreground transition-all hover:brightness-110 active:scale-[0.98]"
          >
            JWE KOUNYE A
          </button>
        </div>
      </div>
    )
  }

  // Won Screen
  if (gameState === "won") {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="flex w-full max-w-md flex-col items-center gap-6 rounded-2xl border border-primary/40 bg-card p-8 text-center shadow-[0_0_60px_rgba(255,215,0,0.25)]">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/20">
            <Trophy className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            FELISITASYON!
          </h2>
          <p className="text-4xl font-bold text-primary">$1,000,000</p>
          <p className="text-muted-foreground">Ou genyen tout lajan an!</p>
          <button
            onClick={startGame}
            className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-primary-foreground transition-all hover:brightness-110"
          >
            <RotateCcw className="h-4 w-4" />
            Jwe Ankò
          </button>
        </div>
      </div>
    )
  }

  // Lost Screen
  if (gameState === "lost") {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="flex w-full max-w-md flex-col items-center gap-6 rounded-2xl border border-destructive/40 bg-card p-8 text-center">
          <h2 className="text-2xl font-bold text-destructive">
            MOVE REPONS!
          </h2>
          <p className="text-muted-foreground">
            Ou te rive nan: <span className="font-bold text-primary">${score.toLocaleString()}</span>
          </p>
          <button
            onClick={startGame}
            className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-primary-foreground transition-all hover:brightness-110"
          >
            <RotateCcw className="h-4 w-4" />
            Rekòmanse
          </button>
        </div>
      </div>
    )
  }

  // Playing Screen
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="flex w-full max-w-2xl flex-col gap-4 lg:flex-row lg:gap-6">
        {/* Main Game Panel */}
        <div className="flex flex-1 flex-col gap-4 rounded-2xl border border-primary/30 bg-card p-5 shadow-[0_0_30px_rgba(255,215,0,0.1)]">
          {/* Score */}
          <div className="text-center text-lg font-bold text-primary">
            Lajan: ${score.toLocaleString()}
          </div>

          {/* Lifelines */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={use5050}
              disabled={used5050 || answerState !== null}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-bold transition-all",
                used5050
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : "bg-primary text-primary-foreground hover:brightness-110 active:scale-95"
              )}
            >
              <Zap className="h-4 w-4" />
              50/50
            </button>
            <button
              onClick={usePublic}
              disabled={usedPublic || answerState !== null}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-bold transition-all",
                usedPublic
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : "bg-primary text-primary-foreground hover:brightness-110 active:scale-95"
              )}
            >
              <Users className="h-4 w-4" />
              Mande Piblik
            </button>
          </div>

          {/* Public hint */}
          {publicHint && (
            <div className="rounded-lg bg-accent/30 px-4 py-2 text-center text-sm text-accent-foreground">
              {publicHint}
            </div>
          )}

          {/* Question */}
          {currentQuestion && (
            <div className="flex min-h-[80px] items-center justify-center rounded-2xl border border-foreground/20 bg-secondary px-5 py-4 text-center">
              <p className="text-base font-medium text-secondary-foreground">
                {currentQuestion.q}
              </p>
            </div>
          )}

          {/* Options Grid */}
          {currentQuestion && (
            <div className="grid grid-cols-2 gap-3">
              {options.map((key) => {
                const isHidden = hiddenOptions.includes(key)
                const isSelected = selectedAnswer === key
                const isCorrect = key === currentQuestion.correct

                let btnClasses =
                  "rounded-full border border-foreground/20 bg-secondary px-4 py-3 text-sm font-medium text-secondary-foreground transition-all hover:bg-secondary/80 active:scale-95"

                if (isHidden) {
                  btnClasses = "invisible"
                } else if (answerState === "correct" && isSelected) {
                  btnClasses =
                    "rounded-full border border-green-500 bg-green-600 px-4 py-3 text-sm font-bold text-foreground"
                } else if (answerState === "wrong" && isSelected) {
                  btnClasses =
                    "rounded-full border border-red-500 bg-red-600 px-4 py-3 text-sm font-bold text-foreground"
                } else if (answerState === "wrong" && isCorrect) {
                  btnClasses =
                    "rounded-full border border-green-500 bg-green-600/30 px-4 py-3 text-sm font-bold text-foreground"
                }

                return (
                  <button
                    key={key}
                    onClick={() => handleAnswer(key)}
                    disabled={answerState !== null || isHidden}
                    className={btnClasses}
                  >
                    {key}: {currentQuestion[key]}
                  </button>
                )
              })}
            </div>
          )}

          {/* Message */}
          {message && (
            <p
              className={cn(
                "text-center text-sm font-medium",
                answerState === "correct" ? "text-green-400" : "text-destructive"
              )}
            >
              {message}
            </p>
          )}
        </div>

        {/* Money Ladder - shown on larger screens */}
        <div className="hidden w-40 rounded-2xl border border-primary/20 bg-card p-3 lg:block">
          <h3 className="mb-2 text-center text-xs font-bold text-primary">
            ECHÈL LAJAN
          </h3>
          <MoneyLadder currentIndex={currentIndex} />
        </div>
      </div>
    </div>
  )
}
