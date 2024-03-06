import RewardCard from "components/common/RewardCard"
import platforms, { CardPropsHook } from "platforms/platforms"
import { PropsWithChildren } from "react"
import { GuildPlatformWithOptionalId, Rest } from "types"

type Props = {
  guildPlatform: GuildPlatformWithOptionalId
  usePlatformProps: CardPropsHook
  titleRightElement?: JSX.Element
  actionRow?: JSX.Element
  cornerButton?: JSX.Element
  contentRow?: JSX.Element
} & Rest

const PlatformCard = ({
  guildPlatform,
  usePlatformProps,
  titleRightElement,
  actionRow,
  cornerButton,
  contentRow,
  children,
  ...rest
}: PropsWithChildren<Props>) => {
  const { info, name, image, type } = usePlatformProps(guildPlatform)

  return (
    <RewardCard
      label={platforms[type].name}
      title={name}
      titleRightElement={titleRightElement}
      description={contentRow ?? info}
      image={image}
      colorScheme={platforms[type].colorScheme}
      {...{ actionRow, cornerButton }}
      {...rest}
    >
      {children}
    </RewardCard>
  )
}

export default PlatformCard
