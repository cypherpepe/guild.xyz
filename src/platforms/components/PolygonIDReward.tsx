import { Icon, Spinner, Tooltip } from "@chakra-ui/react"
import { useOpenJoinModal } from "components/[guild]/JoinModal/JoinModalProvider"
import {
  RewardDisplay,
  RewardIcon,
  RewardProps,
} from "components/[guild]/RoleCard/components/Reward"
import useAccess from "components/[guild]/hooks/useAccess"
import useGuild from "components/[guild]/hooks/useGuild"
import useIsMember from "components/[guild]/hooks/useIsMember"
import Button from "components/common/Button"
import { ArrowSquareOut, LockSimple } from "phosphor-react"
import { useMintPolygonIDProofContext } from "platforms/PolygonID/components/MintPolygonIDProofProvider"
import useConnectedDID from "platforms/PolygonID/hooks/useConnectedDID"
import platforms from "platforms/platforms"
import { useMemo } from "react"
import { PlatformType } from "types"
import { useAccount } from "wagmi"

const PolygonIDReward = ({ platform, withMotionImg }: RewardProps) => {
  const { platformId } = platform.guildPlatform

  const { roles } = useGuild()
  const role = roles.find((r) =>
    r.rolePlatforms.some((rp) => rp.guildPlatformId === platform.guildPlatformId)
  )

  const isMember = useIsMember()
  const { hasAccess, isValidating } = useAccess(role.id)
  const { isConnected } = useAccount()
  const openJoinModal = useOpenJoinModal()

  const { onConnectDIDModalOpen, onMintPolygonIDProofModalOpen } =
    useMintPolygonIDProofContext()
  const { isLoading, data: connectedDID } = useConnectedDID()

  const state = useMemo(() => {
    if (isMember && hasAccess && connectedDID) {
      return {
        tooltipLabel: "Mint proof",
        buttonProps: {
          isDisabled: isLoading || isValidating,
          onClick: onMintPolygonIDProofModalOpen,
        },
      }
    }

    if (!isConnected || (!isMember && hasAccess))
      return {
        tooltipLabel: (
          <>
            <Icon as={LockSimple} display="inline" mb="-2px" mr="1" />
            Join guild to get access
          </>
        ),
        buttonProps: { onClick: openJoinModal },
      }

    if (!connectedDID)
      return {
        tooltipLabel: "Connect DID",
        buttonProps: { onClick: onConnectDIDModalOpen },
      }

    return {
      tooltipLabel: "You don't satisfy the requirements to this role",
      buttonProps: { isDisabled: true },
    }
  }, [isMember, hasAccess, isConnected, platform])

  return (
    <RewardDisplay
      icon={
        <RewardIcon
          rolePlatformId={platform.id}
          guildPlatform={platform?.guildPlatform}
          withMotionImg={withMotionImg}
        />
      }
      label={
        <Tooltip label={state.tooltipLabel} hasArrow shouldWrapChildren>
          {`Mint: `}
          <Button
            variant="link"
            rightIcon={
              isLoading || isValidating ? (
                <Spinner boxSize="1em" />
              ) : (
                <ArrowSquareOut />
              )
            }
            iconSpacing="1"
            maxW="full"
            {...state.buttonProps}
          >
            {platforms[PlatformType[platformId]].name} proofs
          </Button>
        </Tooltip>
      }
    />
  )
}
export default PolygonIDReward