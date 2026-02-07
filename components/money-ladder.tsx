import { cn } from "@/lib/utils"
import { allQuestions } from "@/lib/questions"

interface MoneyLadderProps {
  currentIndex: number
}

export function MoneyLadder({ currentIndex }: MoneyLadderProps) {
  const levels = [...allQuestions].reverse()

  return (
    <div className="flex flex-col gap-1">
      {levels.map((q, i) => {
        const originalIndex = allQuestions.length - 1 - i
        const isActive = originalIndex === currentIndex
        const isPast = originalIndex < currentIndex

        return (
          <div
            key={q.money}
            className={cn(
              "flex items-center justify-between rounded px-3 py-1.5 text-xs font-medium transition-all",
              isActive && "bg-primary text-primary-foreground scale-105",
              isPast && "text-muted-foreground",
              !isActive && !isPast && "text-foreground/60"
            )}
          >
            <span>{originalIndex + 1}.</span>
            <span className={cn(isActive && "font-bold")}>
              ${q.money.toLocaleString()}
            </span>
          </div>
        )
      })}
    </div>
  )
}
