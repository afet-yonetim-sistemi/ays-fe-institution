import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { setCollapsed, setReady } from '@/store/sidebarSlice'

export function useSidebarCollapse() {
  const collapsed = useAppSelector((state) => state.sidebar.collapsed)
  const ready = useAppSelector((state) => state.sidebar.ready)
  const dispatch = useAppDispatch()
  return {
    collapsed,
    ready,
    setCollapsed: (val: boolean) => dispatch(setCollapsed(val)),
    setReady: (val: boolean) => dispatch(setReady(val)),
  }
}
