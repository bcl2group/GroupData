package main;

public class SigValue {
	final double value;
	final boolean isSignificant;
	
	public SigValue(double value, boolean isSignificant) {
		this.value = value;
		this.isSignificant = isSignificant;
	}
}
