import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { observer } from "mobx-react-lite"
import { Props } from '../types';

export const ActionRadioGroup = observer(({model}: Props) => {
  return (
    <RadioGroup defaultValue="transfer" className="w-fit flex">
      <div onClick={() => model.setActiveAction("transfer")} className="flex items-center gap-3">
        <RadioGroupItem value="transfer" id="transfer" />
        <Label htmlFor="transfer">Transfer</Label>
      </div>
      <div onClick={() => model.setActiveAction("invite")} className="flex items-center gap-3">
        <RadioGroupItem value="invite" id="invite" />
        <Label htmlFor="invite">Invite</Label>
      </div>
      <div className="flex items-center gap-3">
        <RadioGroupItem value="vote" id="vote" />
        <Label htmlFor="vote">Vote</Label>
      </div>
    </RadioGroup>
  )
})

